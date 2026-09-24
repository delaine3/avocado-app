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
import CreateChildPlantButton from "@/src/components/CreateChildPlantButton";
import LoadingLink from "@/src/components/LoadingLink";
import { createChildPlant } from "../new/actions";
import Link from "next/link";

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

type PlantWithProfile = Plant & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type ParentPlant = {
  id: number;
  name: string;
} | null;

type ChildPlant = {
  id: number;
  name: string;
  stage: string | null;
  in_soil: boolean;
  is_private: boolean;
};

export default async function PlantDetailPage({
  params,
  searchParams,
}: PlantDetailPageProps) {
  const currPage = await searchParams; //get search parameter object
  const page = Math.max(1, Math.floor(Number(currPage.page)) || 1); //convert page to a number, default to 1, never allow anything below 1, round down to nearest int
  const pageSize = 10;
  const from = (page - 1) * pageSize; // - 1 makes sure that we index starting at 0
  const to = from + pageSize - 1; // take the starting index and calculate the inclusive end index for 10 records
  const supabase = await createSupabaseServerClient();

  const { id } = await params;
  const plantId = Number(id);

  if (Number.isNaN(plantId)) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: plant, error: plantError } = await supabase
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
    .eq("id", plantId)
    .single();

  if (plantError || !plant) {
    notFound();
  }

  const typedPlant = plant as PlantWithProfile;
  const isOwner = typedPlant.user_id === user.id;

  if (!isOwner && typedPlant.is_private) {
    notFound();
  }

  let careLogsQuery = supabase
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
      { count: "exact" },
    )
    .eq("plant_id", plantId)
    .order("action_date", { ascending: false })
    .range(from, to);

  if (!isOwner) {
    careLogsQuery = careLogsQuery.eq("is_private", false);
  }

  const [
    { data: careLogs, error: careLogsError, count },
    { data: allPlants },
    { data: childPlants },
    { data: parentPlant },
  ] = await Promise.all([
    careLogsQuery,

    supabase
      .from("plants")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),

    supabase
      .from("plants")
      .select("id, name, stage, in_soil, is_private")
      .eq("parent_plant_id", plantId)
      .order("name", { ascending: true }),

    typedPlant.parent_plant_id
      ? supabase
          .from("plants")
          .select("id, name")
          .eq("id", typedPlant.parent_plant_id)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const typedCareLogs = (careLogs ?? []) as CareLog[];
  const typedChildPlants = (childPlants ?? []) as ChildPlant[];
  const typedParentPlant = parentPlant as ParentPlant;

  const plantOptions = (
    (allPlants ?? []) as { id: number; name: string }[]
  ).map((plant) => ({
    id: plant.id,
    name: plant.name,
  }));

  const owner =
    typedPlant.profiles?.username ??
    typedPlant.profiles?.full_name ??
    "Unknown";

  const totalPages = Math.ceil((count ?? 0) / pageSize);
  if (totalPages > 0 && page > totalPages) {
    redirect(`/plants/${plantId}?page=${totalPages}`);
  }

  const visiblePages = Array.from(
    { length: Math.min(10, totalPages - page + 1) },
    (_, index) => page + index,
  );

  `/plants/${plantId}?page=${totalPages}`;
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 page">
      <div className="page-header mb-6"></div>

      <div className="page-header">
        <h1 className="title">Plant Profile</h1>

        <h1 className="title-sm">
          {toTitleCase(owner)}&apos;s plant {typedPlant.name}
        </h1>

        <p>{typedPlant.notes ?? ""}</p>
      </div>

      <div className="field-form">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="mt-4">
            <h1 className="title-sm mb-2">
              <span className="plant-label">Plant Name:</span>
              <span className="plant-name-value">{typedPlant.name}🌱🥑</span>
            </h1>

            {isOwner && (
              <div className="flex flex-wrap gap-3">
                <EditPlantButton action={updatePlant} plant={typedPlant} />

                <CreateChildPlantButton
                  parentPlantId={typedPlant.id}
                  parentPlantName={typedPlant.name}
                  action={createChildPlant}
                />
              </div>
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
          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Stage</h2>
            <p className="mt-2">{toTitleCase(typedPlant.stage)}</p>
          </div>

          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Started</h2>
            <p className="mt-2">
              {typedPlant.started_at
                ? formatDate(typedPlant.started_at)
                : "Not set"}
            </p>
          </div>

          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="mt-2">{typedPlant.location ?? "Not set"}</p>
          </div>

          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Visibility</h2>
            <p className="mt-2">
              {typedPlant.is_private ? "🔒 Private" : "🌍 Public"}
            </p>
          </div>

          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Care Mode</h2>
            <p className="mt-2">
              {typedPlant.in_soil ? "🪴 In soil" : "💧 In water"}
            </p>
          </div>

          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Container Type</h2>
            <p className="mt-2">
              {typedPlant.container_type
                ? toTitleCase(typedPlant.container_type)
                : "Not set"}
            </p>
          </div>
          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold">Health Status</h2>
            <p className="mt-2">{toTitleCase(typedPlant.health_status)}</p>
          </div>
          <div className="rounded border p-2">
            <h2 className="text-lg font-semibold"> Status</h2>
            <p className="mt-2">{toTitleCase(typedPlant.plant_status)}</p>
          </div>
        </section>

        {typedChildPlants.length > 0 && (
          <section className="mt-8 rounded border p-2">
            <h2 className="text-lg font-semibold">Child Plants</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {typedChildPlants.map((child) => (
                <LoadingLink
                  key={child.id}
                  href={`/plants/${child.id}`}
                  className="rounded border bg-white/60 p-3 hover:bg-white"
                >
                  <p className="font-semibold">{child.name}</p>

                  <p className="text-sm">
                    {child.stage ? toTitleCase(child.stage) : "Stage not set"}
                  </p>

                  <p className="text-sm">
                    {child.in_soil ? "🪴 In soil" : "💧 In water"}
                  </p>

                  <p className="text-xs">
                    {child.is_private ? "🔒 Private" : "🌍 Public"}
                  </p>
                </LoadingLink>
              ))}
            </div>
          </section>
        )}

        <section
          className={`mt-8 grid grid-cols-1 gap-4 ${
            isOwner ? "sm:grid-cols-2" : ""
          }`}
        >
          {isOwner && (
            <div className="rounded border p-2">
              <h2 className="text-lg font-semibold">Add Care Log</h2>

              <CareLogForm
                plantId={typedPlant.id}
                plantStage={typedPlant.stage}
              />
            </div>
          )}

          <div className="flex flex-col rounded border p-4 sm:h-[32rem] sm:p-2">
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
                          <p>{log.notes ?? ""}</p>
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
                                plant_id: typedPlant.id,
                                plant_name: typedPlant.name,
                                action_type: log.action_type,
                                action_date: log.action_date,
                                notes: log.notes,
                                created_at: log.created_at,
                                photo_url: log.photo_url,
                                container_type: typedPlant.container_type,
                                is_private: log.is_private,
                                care_log_photos: log.care_log_photos,
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
            )}{" "}
            <div className="mt-8 flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  className="rounded-lg bg-[#4a2c14] px-4 py-2 text-lg text-white"
                  href={`/plants/${plantId}?page=${page - 1}`}
                >
                  ❮
                </Link>
              )}
              <span>
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  className="rounded-lg bg-[#4a2c14] px-4 py-2 text-lg text-white"
                  href={`/plants/${plantId}?page=${page + 1}`}
                >
                  ❯
                </Link>
              )}
              {page > 1 && (
                <Link
                  className="rounded border p-2"
                  href={`/plants/${plantId}?page=${1}`}
                >
                  1
                </Link>
              )}
              {visiblePages.map((pageNumber) => (
                <Link
                  className="rounded border p-2"
                  key={pageNumber}
                  href={`/plants/${plantId}?page=${pageNumber}`}
                >
                  {pageNumber}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  className="rounded border p-2"
                  href={`/plants/${plantId}?page=${totalPages}`}
                >
                  Last
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
