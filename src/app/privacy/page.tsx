export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-10 page">
      <div className="mx-auto max-w-3xl rounded field-form">
        <h1 className="title">Privacy Policy</h1>

        <p className="mt-4">
          AvoLog helps users track avocado plants, care logs, photos, comments,
          likes, and plant progress. This policy explains what information the
          app collects and how it is used.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Information We Collect</h2>
        <p className="mt-2">
          We may collect account information such as email address, username,
          display name, and avatar. We also collect plant information, care
          logs, photos, comments, likes, timestamps, and visibility settings
          selected by the user.
        </p>

        <h2 className="mt-8 text-xl font-semibold">How We Use Information</h2>
        <p className="mt-2">
          We use this information to create accounts, display plant profiles,
          store care history, show public feed posts, support comments and
          likes, and maintain app functionality.
        </p>

        <h2 className="mt-8 text-xl font-semibold">
          Public and Private Content
        </h2>
        <p className="mt-2">
          Public plants and public care logs may be visible to other users.
          Private plants and private care logs are intended to be visible only
          to the account owner. Users are responsible for choosing the
          appropriate privacy settings before posting.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Photos</h2>
        <p className="mt-2">
          Users should avoid uploading photos that reveal faces, addresses,
          private documents, or sensitive locations. Photos may be stored and
          displayed in the app according to the user’s privacy settings.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Third-Party Services</h2>
        <p className="mt-2">
          AvoLog uses third-party service providers for hosting, authentication,
          database storage, file storage, and email delivery. These providers
          may process data as needed to operate the app.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Data Deletion</h2>
        <p className="mt-2">
          Users may delete plants, care logs, comments, and uploaded content
          where deletion tools are available. For account or data deletion
          requests, contact the app operator.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Children</h2>
        <p className="mt-2">
          AvoLog is not intended for children under 13. Users under 13 should
          not create an account or submit personal information.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Security</h2>
        <p className="mt-2">
          We use authentication, database permissions, and access controls to
          protect user content. No online service can guarantee complete
          security.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p className="mt-2">
          For privacy questions or deletion requests, contact the app operator
          at the support email provided in the app.
        </p>
      </div>
    </main>
  );
}
