export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">AvoLog</h1>
        <p className="mt-3 text-lg text-stone-600">
          Track your avocado squad, water changes, growth, and photos.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Future Tree</h2>
            <p className="mt-2 text-sm text-stone-600">Stage: dormant</p>
            <p className="text-sm text-stone-600">
              Last water change: not logged yet
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Earth</h2>
            <p className="mt-2 text-sm text-stone-600">Stage: rooting</p>
            <p className="text-sm text-stone-600">
              Last water change: not logged yet
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Flora</h2>
            <p className="mt-2 text-sm text-stone-600">Stage: rooting</p>
            <p className="text-sm text-stone-600">
              Last water change: 4/11/2026
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Green Goddess Gaia</h2>
            <p className="mt-2 text-sm text-stone-600">Stage: rooting</p>
            <p className="text-sm text-stone-600">
              Last water change: 4/11/2026
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
