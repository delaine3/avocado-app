export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-10 page">
      <div className="mx-auto max-w-3xl rounded field-form">
        <h1 className="title">Terms of Use</h1>

        <p className="mt-4">
          By using AvoLog, you agree to use the app responsibly and follow these
          terms.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Account Responsibility</h2>
        <p className="mt-2">
          You are responsible for your account activity and for keeping your
          login information secure.
        </p>

        <h2 className="mt-8 text-xl font-semibold">User Content</h2>
        <p className="mt-2">
          You retain ownership of the photos, comments, care logs, and plant
          information you upload. By posting content, you grant AvoLog
          permission to store, process, and display that content within the app
          according to your privacy settings.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Public Content</h2>
        <p className="mt-2">
          Content marked public may be visible to other users. Do not upload
          content you do not have permission to share.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Prohibited Use</h2>
        <p className="mt-2">
          You may not use AvoLog to upload illegal, abusive, harassing,
          exploitative, hateful, sexually explicit, invasive, or harmful
          content. You may not attempt to access another user’s private content
          or interfere with the app’s security.
        </p>

        <h2 className="mt-8 text-xl font-semibold">No Professional Advice</h2>
        <p className="mt-2">
          AvoLog is a tracking tool. It does not provide professional plant,
          agricultural, pest-control, environmental, legal, medical, or
          financial advice.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Service Changes</h2>
        <p className="mt-2">
          AvoLog may change, pause, or discontinue features. We may remove
          content or restrict accounts that violate these terms.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Limitation of Liability</h2>
        <p className="mt-2">
          AvoLog is provided as-is. To the extent allowed by law, the app
          operator is not responsible for losses resulting from use of the app,
          unavailable service, data loss, user content, or reliance on plant
          care information stored in the app.
        </p>
      </div>
    </main>
  );
}
