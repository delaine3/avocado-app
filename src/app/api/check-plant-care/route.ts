import { Resend } from "resend";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const isManualTest = searchParams.get("test") === "true";

  if (!isManualTest) {
    return new Response("Add ?test=true", { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return new Response("Missing RESEND_API_KEY", { status: 500 });
  }

  if (!process.env.CARE_REMINDER_EMAIL) {
    return new Response("Missing CARE_REMINDER_EMAIL", { status: 500 });
  }
  const supabase = await createSupabaseServerClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Get plants
  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("id, name");

  if (plantsError) {
    return new Response(plantsError.message, { status: 500 });
  }

  // 2. Get care logs (latest first)
  const { data: careLogs, error: logsError } = await supabase
    .from("care_logs")
    .select("plant_id, action_date")
    .order("action_date", { ascending: false });

  if (logsError) {
    return new Response(logsError.message, { status: 500 });
  }

  const now = new Date();

  // 3. Find neglected plants (3+ days)
  const neglectedPlants = (plants ?? []).filter((plant) => {
    const latestLog = (careLogs ?? []).find((log) => log.plant_id === plant.id);

    if (!latestLog) return true;

    const lastCareDate = new Date(latestLog.action_date);
    const daysSinceCare =
      (now.getTime() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceCare >= 3;
  });

  // 4. If nothing needs care
  if (neglectedPlants.length === 0) {
    return new Response("All plants are cared for 🌱", { status: 200 });
  }

  // 5. Build email content
  const plantListText = neglectedPlants.map((p) => `• ${p.name}`).join("\n");

  const plantListHtml = neglectedPlants
    .map((p) => `<li>${p.name}</li>`)
    .join("");

  // 6. Send email
  const { error } = await resend.emails.send({
    from: "AvoLog <onboarding@resend.dev>",
    to: process.env.CARE_REMINDER_EMAIL!,
    subject: "Your avocados need attention 🥑",
    text: `The following plants have not been tended in 3+ days:\n\n${plantListText}`,
    html: `
      <h2>Your avocados need attention 🥑</h2>
      <p>The following plants have not been tended in 3+ days:</p>
      <ul>${plantListHtml}</ul>
      <p>Go take care of your squad 🌱</p>
    `,
  });

  if (error) {
    return new Response(`Resend error: ${error.message}`, { status: 500 });
  }

  return new Response("Reminder email sent 🥑", { status: 200 });
}
