import { Resend } from "resend";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const isCron = req.headers.get("x-vercel-cron") === "1";
  const isManualTest = searchParams.get("test") === "true";

  if (!isCron && !isManualTest) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("id, name");

  if (plantsError) {
    return new Response(plantsError.message, { status: 500 });
  }

  const { data: careLogs, error: logsError } = await supabase
    .from("care_logs")
    .select("plant_id, action_date")
    .order("action_date", { ascending: false });

  if (logsError) {
    return new Response(logsError.message, { status: 500 });
  }

  const now = new Date();

  const plantsNeedingCare = (plants ?? []).filter((plant) => {
    const latestLog = (careLogs ?? []).find((log) => log.plant_id === plant.id);

    if (!latestLog) return true;

    const lastCareDate = new Date(latestLog.action_date);
    const daysSinceCare =
      (now.getTime() - lastCareDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceCare >= 3;
  });

  if (plantsNeedingCare.length === 0) {
    return new Response("All plants are cared for 🌱", { status: 200 });
  }

  const plantList = plantsNeedingCare
    .map((plant) => `• ${plant.name}`)
    .join("\n");

  const { error: emailError } = await resend.emails.send({
    from: "AvoLog <onboarding@resend.dev>",
    to: process.env.CARE_REMINDER_EMAIL!,
    subject: "Your avocados need attention 🥑",
    text: `These plants have not been tended in 3+ days:\n\n${plantList}`,
  });

  if (emailError) {
    return new Response(emailError.message, { status: 500 });
  }

  return new Response("Reminder sent 🥑", { status: 200 });
}
