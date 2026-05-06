import { notFound, redirect } from "next/navigation";
import type { Plant } from "../../../types/plant";
import type { CareLog } from "../../../types/care-log";
import {
  deleteCareLog,
  updateCareLog,
  updatePlant,
} from "../../../app/actions/plant-actions";
import { Trash2 } from "lucide-react";
import ActionFormButton from "@/src/components/ActionFormButton";
import EditCareLogButton from "@/src/components/EditCareLogButton";
import EditPlantButton from "@/src/components/EditPlantButton";
import { formatDate, toTitleCase } from "../../utilities/format";
import PlantTypeaheadSelect from "@/src/components/PlantTypeaheadSelect";
import CareLogForm from "@/src/components/CareLogForm";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import { getLogTypeMeta } from "@/src/lib/getLogTypeMeta";
import PhotoCarousel from "@/src/components/PhotoCarousel";

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

type PlantWithProfile = Plant & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: plant, error: plantError },
    { data: careLogs, error: careLogsError },
    { data: allPlants },
  ] = await Promise.all([
    supabase
      .from("plants")
      .select(
        `
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `,
      )
      .eq("id", id)
      .single(),

    supabase
      .from("care_logs")
      .select(
        `
          *,
          care_log_photos (
            id,
            photo_url,
            storage_path,
            created_at
          )
        `,
      )
      .eq("plant_id", id)
      .order("action_date", { ascending: false }),

    supabase
      .from("plants")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
  ]);

  if (plantError || !plant) {
    notFound();
  }

  const typedPlant = plant as PlantWithProfile;
  const typedCareLogs = (careLogs ?? []) as CareLog[];

  const plantOptions = (
    (allPlants ?? []) as { id: number; name: string }[]
  ).map((plant) => ({
    id: plant.id,
    name: plant.name,
  }));

  const isOwner = typedPlant.user_id === user.id;

  const owner =
    typedPlant.profiles?.username ??
    typedPlant.profiles?.full_name ??
    "Unknown";

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 page">
      <div className="page-header mb-6"></div>

      <div className="page-header">
        <h1 className="title">Plant Profile</h1>

        <h1 className="title-sm">
          {toTitleCase(owner)}&apos;s plant {typedPlant.name}
        </h1>

        <p>{typedPlant.notes ?? "No notes yet."}</p>
      </div>

      <div className="field-form">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="mt-4">
            <h1 className="title-sm mb-2">
              <span className="plant-label">Plant Name:</span>
              <span className="plant-name-value">{typedPlant.name}🌱🥑</span>
            </h1>

            {isOwner && (
              <EditPlantButton
                action={updatePlant}
                plant={{
                  id: typedPlant.id,
                  name: typedPlant.name,
                  started_at: typedPlant.started_at,
                  stage: typedPlant.stage,
                  location: typedPlant.location,
                  container_type: typedPlant.container_type,
                  notes: typedPlant.notes,
                }}
              />
            )}
          </div>

          <div className="mt-4 flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end md:ml-auto">
            {isOwner && (
              <PlantTypeaheadSelect
                plants={plantOptions}
                currentPlantId={typedPlant.id}
              />
            )}
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Stage</h2>
            <p className="mt-2">{toTitleCase(typedPlant.stage)}</p>
          </div>

          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Started</h2>
            <p className="mt-2">
              {typedPlant.started_at
                ? formatDate(typedPlant.started_at)
                : "Not set"}
            </p>
          </div>

          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="mt-2">{typedPlant.location ?? "Not set"}</p>
          </div>

          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Visibility</h2>
            <p className="mt-2">
              {typedPlant.is_private ? "🔒 Private" : "🌍 Public"}
            </p>
          </div>

          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Container Type</h2>
            <p className="mt-2">
              {typedPlant.container_type
                ? toTitleCase(typedPlant.container_type)
                : "Not set"}
            </p>
          </div>

          <div className="rounded border p-5">
            <h2 className="text-lg font-semibold">Created</h2>
            <p className="mt-2">{formatDate(typedPlant.created_at)}</p>
          </div>
        </section>

        <section
          className={`mt-8 grid grid-cols-1 gap-4 ${
            isOwner ? "sm:grid-cols-2" : ""
          }`}
        >
          {isOwner && (
            <div className="rounded border p-5">
              <h2 className="text-lg font-semibold">Add Care Log</h2>
              <CareLogForm
                plantId={typedPlant.id}
                plantStage={typedPlant.stage}
              />
            </div>
          )}

          <div className="flex flex-col rounded border p-4 sm:h-[32rem] sm:p-5">
            <h2 className="text-lg font-semibold">Care History</h2>

            {careLogsError && (
              <p className="mt-3 text-red-600">
                Failed to load care logs: {careLogsError.message}
              </p>
            )}

            {typedCareLogs.length === 0 ? (
              <p className="mt-3">No care logs yet.</p>
            ) : (
              <div className="mt-4 flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {typedCareLogs.map((log) => {
                    const logMeta = getLogTypeMeta(log.action_type);

                    return (
                      <div
                        key={log.id}
                        className="space-y-2 rounded p-4"
                        style={{ background: "rgba(37, 149, 190, 0.31)" }}
                      >
                        <div className="flex items-start justify-between gap-3 font-medium">
                          <span
                            className={`inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-normal sm:px-3 sm:text-xs sm:tracking-wide ${logMeta.className}`}
                          >
                            <span className="leading-none">{logMeta.icon}</span>
                            {logMeta.label}
                          </span>

                          <div
                            className={`rounded px-2 py-1 text-xs ${
                              log.is_private
                                ? "bg-red-200 text-red-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {log.is_private ? "🔒 Private" : "🌍 Public"}
                          </div>
                        </div>

                        <div style={{ color: "#2596be" }}>
                          <div>{formatDate(log.action_date)}</div>
                          <p>{log.notes ?? "No notes recorded."}</p>
                        </div>

                        {log.care_log_photos &&
                          log.care_log_photos.length > 0 && (
                            <PhotoCarousel
                              photos={log.care_log_photos}
                              altBase={`Care log photo for ${typedPlant.name}`}
                            />
                          )}

                        {isOwner && (
                          <div className="flex flex-wrap items-center gap-2">
                            <EditCareLogButton
                              action={updateCareLog}
                              log={{
                                id: log.id,
                                plant_name: typedPlant.name,
                                plant_stage: typedPlant.stage,
                                container_type: typedPlant.container_type,
                                plant_id: typedPlant.id,
                                action_type: log.action_type,
                                action_date: log.action_date,
                                notes: log.notes,
                                icon: true,
                              }}
                            />

                            <ActionFormButton
                              action={deleteCareLog}
                              hiddenFields={[
                                { name: "log_id", value: log.id },
                                { name: "plant_id", value: typedPlant.id },
                              ]}
                              title="Delete this care log?"
                              description="This action cannot be undone."
                            >
                              <Trash2 size={16} />
                            </ActionFormButton>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
