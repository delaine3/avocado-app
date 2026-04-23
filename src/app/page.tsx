import Link from "next/link";
import type { Plant } from "../types/plant";
import { createSupabaseServerClient } from "../lib/supabase-server";
import { Trash2 } from "lucide-react";
import ActionFormButton from "../components/ActionFormButton";
import { deletePlant, updatePlant } from "./actions/plant-actions";
import EditPlantButton from "../components/EditPlantButton";
import { toTitleCase } from "./utilities/format";
export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen p-8 page">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight title">AvoLog</h1>
            <p className="mt-3 text-lg">
              Track your avocado squad, water changes, growth, and photos.
            </p>
          </div>

          <Link href="/plants/new" className="create-button">
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
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: "#9d772d" }}
            >
              <Link
                href={`/plants/${plant.id}`}
                className="block"
                style={{ color: "#ffffff" }}
              >
                <h2 className="text-xl font-semibold">{plant.name}</h2>
                <p className="mt-2 ">Stage: {toTitleCase(plant.stage)}</p>
                <p className="">Location: {plant.location ?? "Not set"}</p>
                <p className="">
                  Container: {plant.container_type ?? "Not set"}
                </p>
                {plant.notes && <p className="mt-3 ">{plant.notes}</p>}
              </Link>
              <ActionFormButton
                action={deletePlant}
                hiddenFields={[{ name: "plant_id", value: plant.id }]}
                title={`Delete ${plant.name}?`}
                description={
                  <>
                    <span className="block">This will permanently remove:</span>

                    <span
                      className="mt-2 block text-lg font-semibold"
                      style={{ color: "#686e29" }}
                    >
                      {plant.name}
                    </span>

                    <span className="mt-2 block">
                      Including all care logs and related history.
                    </span>
                  </>
                }
                redirectTo="/"
                className="py-2  text-red-700"
              >
                <Trash2 size={16} />
              </ActionFormButton>
              <EditPlantButton
                action={updatePlant}
                plant={{
                  id: plant.id,
                  name: plant.name,
                  started_at: plant.started_at,
                  stage: plant.stage,
                  location: plant.location,
                  container_type: plant.container_type,
                  notes: plant.notes,
                }}
              />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
