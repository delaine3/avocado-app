import { Resend } from "resend";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  // get all plants
  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("id, name");

  if (plantsError) {
    return new Response(plantsError.message, { status: 500 });
  }

  // get latest care logs per plant
  const { data: careLogs, error: logsError } = await supabase
    .from("care_logs")
    .select("plant_id, action_date")
    .order("action_date", { ascending: false });

  if (logsError) {
    return new Response(logsError.message, { status: 500 });
  }

  const now = new Date();

  const neglectedPlants = (plants ?? []).filter((plant) => {
    const plantLogs = (careLogs ?? []).filter(
      (log) => log.plant_id === plant.id,
    );

    if (plantLogs.length === 0) return true;

    const lastCare = new Date(plantLogs[0].action_date);
    const diffDays =
      (now.getTime() - lastCare.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays >= 3;
  });

  if (neglectedPlants.length === 0) {
    return new Response("All plants are thriving 🌱", { status: 200 });
  }

  const plantList = neglectedPlants.map((p) => `• ${p.name}`).join("\n");

  await resend.emails.send({
    from: "AvoLog <onboarding@resend.dev>",
    to: process.env.CARE_REMINDER_EMAIL!,
    subject: "Your avocados need attention 🥑",
    text: `The following plants have not been tended in 3+ days:\n\n${plantList}`,
  });

  return new Response("Reminder sent 🌱", { status: 200 });
}
