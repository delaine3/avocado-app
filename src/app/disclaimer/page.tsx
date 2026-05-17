export default function DisclaimerPage() {
  return (
    <main className="min-h-screen px-6 py-10 page">
      <div className="mx-auto max-w-3xl rounded field-form">
        <h1 className="title">Disclaimer</h1>

        <p className="mt-4">
          AvoLog is a plant tracking and journaling tool. It helps users record
          observations, photos, care actions, and growth history.
        </p>

        <h2 className="mt-8 text-xl font-semibold">
          No Professional Plant Advice
        </h2>
        <p className="mt-2">
          AvoLog does not guarantee plant health, growth, survival, fruiting, or
          successful propagation. Information in the app may be incomplete,
          inaccurate, user-generated, or specific to individual conditions.
        </p>

        <h2 className="mt-8 text-xl font-semibold">User Responsibility</h2>
        <p className="mt-2">
          Users are responsible for their own plant care decisions, including
          watering, fertilizing, pruning, transplanting, pest treatment, and
          outdoor planting.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Photos and Privacy</h2>
        <p className="mt-2">
          Users should avoid uploading photos that reveal private spaces,
          addresses, faces, documents, or sensitive locations.
        </p>
      </div>
    </main>
  );
}
