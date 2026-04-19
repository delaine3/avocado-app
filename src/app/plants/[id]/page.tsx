import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Plant } from "../../../types/plant";

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  const { id } = await params;

  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plant) {
    notFound();
  }

  const typedPlant = plant as Plant;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-stone-600 underline underline-offset-4"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
                Plant Profile
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {typedPlant.name}
              </h1>
              <p className="mt-3 text-stone-600">
                {typedPlant.notes ?? "No notes yet."}
              </p>
            </div>

            <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
              Stage: <span className="font-medium">{typedPlant.stage}</span>
            </div>
          </div>

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Started</h2>
              <p className="mt-2 text-stone-600">
                {typedPlant.started_at ?? "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Location</h2>
              <p className="mt-2 text-stone-600">
                {typedPlant.location ?? "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Container Type</h2>
              <p className="mt-2 text-stone-600">
                {typedPlant.container_type ?? "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Created</h2>
              <p className="mt-2 text-stone-600">
                {new Date(typedPlant.created_at).toLocaleDateString()}
              </p>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Water Logs</h2>
              <p className="mt-2 text-sm text-stone-600">
                Coming next. This is where water changes and care events will
                appear.
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">Photo Journal</h2>
              <p className="mt-2 text-sm text-stone-600">
                Coming next. This is where progress photos will live.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
