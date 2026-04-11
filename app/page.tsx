export default function HomePage() {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">AvoLog</h1>
        <p className="mt-3 text-lg text-stone-600">
          Track your avocado squad, water changes, growth, and photos.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Environment Check</h2>
          <p className="mt-2 text-sm text-stone-600">
            Supabase URL loaded: {hasSupabaseUrl ? "yes" : "no"}
          </p>
          <p className="text-sm text-stone-600">
            Supabase anon key loaded: {hasSupabaseKey ? "yes" : "no"}
          </p>
        </div>
      </div>
    </main>
  );
}
