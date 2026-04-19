import Link from "next/link";
import { supabase } from "../lib/supabase";
import type { Plant } from "../types/plant";

export default async function HomePage() {
  const { data: plants, error } = await supabase
    .from("plants")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">AvoLog</h1>
            <p className="mt-3 text-lg text-stone-600">
              Track your avocado squad, water changes, growth, and photos.
            </p>
          </div>

          <Link
            href="/plants/new"
            className="rounded-xl bg-stone-900 px-4 py-3 text-white transition hover:opacity-90"
          >
            Add Plant
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load plants: {error.message}
          </div>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(plants as Plant[] | null)?.map((plant) => (
            <div
              key={plant.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{plant.name}</h2>
              <p className="mt-2 text-sm text-stone-600">
                Stage: {plant.stage}
              </p>
              <p className="text-sm text-stone-600">
                Location: {plant.location ?? "Not set"}
              </p>
              <p className="text-sm text-stone-600">
                Container: {plant.container_type ?? "Not set"}
              </p>
              {plant.notes && (
                <p className="mt-3 text-sm text-stone-700">{plant.notes}</p>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
