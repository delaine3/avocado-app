import { Resend } from "resend";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const isManualTest = searchParams.get("test") === "true";

  if (!isManualTest) {
    return new Response("Add ?test=true", { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return new Response("Missing RESEND_API_KEY", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "AvoLog <onboarding@resend.dev>",
    to: process.env.CARE_REMINDER_EMAIL!,
    subject: "AvoLog Test Email 🥑",
    html: "<p>This is your first working email 🎉</p>",
  });

  if (error) {
    return new Response(`Resend error: ${error.message}`, { status: 500 });
  }

  return new Response("Email sent successfully 🎉", { status: 200 });
}
