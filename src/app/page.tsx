import Link from "next/link";
import type { Plant } from "../types/plant";
import { createSupabaseServerClient } from "../lib/supabase-server";
import { Trash2 } from "lucide-react";
import ActionFormButton from "../components/ActionFormButton";
import { deletePlant, updatePlant } from "./actions/plant-actions";
import EditPlantButton from "../components/EditPlantButton";
import { formatDate, toTitleCase } from "./utilities/format";
import { redirect } from "next/navigation";
import LoadingLink from "../components/LoadingLink";

type CareLogForDashboard = {
  plant_id: number;
  action_date: string;
  created_at: string;
  photo_url: string | null;
  care_log_photos?: {
    id: number;
    photo_url: string;
  }[];
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: plants, error }, { data: careLogs, error: careLogsError }] =
    await Promise.all([
      supabase.from("plants").select("*").eq("user_id", user.id),
      supabase
        .from("care_logs")
        .select(
          `
            plant_id,
            action_date,
            created_at,
            photo_url,
            care_log_photos (
              id,
              photo_url
            )
          `,
        )
        .eq("user_id", user.id)
        .order("action_date", { ascending: false }),
    ]);

  const typedCareLogs = (careLogs ?? []) as CareLogForDashboard[];

  const plantsWithCareData = ((plants as Plant[] | null) ?? [])
    .map((plant) => {
      const plantLogs = typedCareLogs.filter(
        (log) => log.plant_id === plant.id,
      );

      const mostRecentCareLog = plantLogs[0];

      const mostRecentPhotoLog = plantLogs.find(
        (log) =>
          log.photo_url ||
          (log.care_log_photos && log.care_log_photos.length > 0),
      );

      const recentPhotoUrl =
        mostRecentPhotoLog?.care_log_photos?.[0]?.photo_url ??
        mostRecentPhotoLog?.photo_url ??
        null;

      return {
        ...plant,
        last_care_date: mostRecentCareLog?.action_date ?? null,
        recent_photo_url: recentPhotoUrl,
      };
    })
    .sort((a, b) => {
      if (!a.last_care_date) return -1;
      if (!b.last_care_date) return 1;

      return (
        new Date(a.last_care_date).getTime() -
        new Date(b.last_care_date).getTime()
      );
    });

  return (
    <main className="min-h-screen p-8 page">
      <div className="mx-auto max-w-5xl">
        <div
          className="flex items-start justify-between gap-3 rounded border border-white/30 p-4 shadow-sm"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            backgroundColor: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight title">
              AvoLog🌱🥑
            </h1>
            <p className="mt-3 text-lg">
              Track your plant squad, water changes, growth, and photos.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load plants: {error.message}
          </div>
        )}

        {careLogsError && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load care logs: {careLogsError.message}
          </div>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plantsWithCareData.map((plant) => (
            <div
              key={plant.id}
              className="flex h-full flex-col rounded border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{
                background:
                  "linear-gradient(147deg, #9d772d, #8d6b29, #a78542,#b19257,#9d772d,#5e471b)",
              }}
            >
              <LoadingLink
                href={`/plants/${plant.id}`}
                className="block flex-1"
              >
                {plant.recent_photo_url && (
                  <img
                    src={plant.recent_photo_url}
                    alt={`Most recent care photo for ${plant.name}`}
                    className="mb-4 h-100 w-full rounded object-cover"
                  />
                )}

                <h2 className="text-xl font-semibold">{plant.name}</h2>

                <p className="mt-2">Stage: {toTitleCase(plant.stage)}</p>

                <span
                  className={`inline-block rounded px-2 py-1 text-xs ${
                    plant.is_private
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {plant.is_private ? "🔒 Private" : "🌍 Public"}
                </span>

                <p>
                  Last cared:{" "}
                  {plant.last_care_date
                    ? formatDate(plant.last_care_date)
                    : "No care logs yet"}
                </p>

                <p>Location: {plant.location ?? "Not set"}</p>

                <p>
                  Container:{" "}
                  {plant.container_type
                    ? toTitleCase(plant.container_type)
                    : "Not set"}
                </p>

                {plant.notes && (
                  <p className="mt-3 max-h-20 overflow-hidden">{plant.notes}</p>
                )}
              </LoadingLink>

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                <ActionFormButton
                  action={deletePlant}
                  hiddenFields={[{ name: "plant_id", value: plant.id }]}
                  title={`Delete ${plant.name}?`}
                  description={
                    <>
                      <span className="block">
                        This will permanently remove:
                      </span>

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
                    user_id: plant.user_id,
                    is_private: plant.is_private,
                    created_at: plant.created_at,
                    updated_at: plant.updated_at,
                    in_soil: plant.in_soil,
                    parent_plant_id: plant.parent_plant_id,
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
