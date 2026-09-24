import type { Plant } from "../types/plant";
import { createSupabaseServerClient } from "../lib/supabase-server";
import { Trash2 } from "lucide-react";
import ActionFormButton from "../components/ActionFormButton";
import { deletePlant, updatePlant } from "./actions/plant-actions";
import EditPlantButton from "../components/EditPlantButton";
import { formatDate, toTitleCase } from "./utilities/format";
import { redirect } from "next/navigation";
import LoadingLink from "../components/LoadingLink";
import Link from "next/link";
import FilterForm from "../components/FilterForm";

const plantStatusStyles = {
  active: "bg-green-200 text-green-800",
  gifted: "bg-orange-200 text-orange-800",
  archived: "bg-yellow-200 text-yellow-800",
};
const healthStatusStyles = {
  healthy: "bg-green-200 text-green-800",
  struggling: "bg-orange-200 text-orange-800",
  recovering: "bg-yellow-200 text-yellow-800",
  dead: "bg-gray-300 text-gray-800",
};
type CareLogForDashboard = {
  plant_id: number;
  action_type: string;
  action_date: string;
  created_at: string;
  photo_url: string | null;
  care_log_photos?: {
    id: number;
    photo_url: string;
  }[];
};

type PlantWithCareData = Plant & {
  last_care_date: string | null;
  most_recent_action: string | null;
  recent_photo_url: string | null;
};

export default async function HomePage({
  searchParams, // pull the searchParams property out of the object Next.js passes in
}: {
  searchParams: Promise<{
    page?: string;
    health?: string;
    status?: string;
    sort?: string;
  }>; // describes the type of the object Next.js will pass in
}) {
  const params = await searchParams; //get search parameter object
  const sort = params.sort ?? "newest";
  const healthFilter = params.health;
  const plantStatus = params.status;
  const page = Math.max(1, Math.floor(Number(params.page)) || 1); //convert page to a number, default to 1, never allow anything below 1, round down to nearest int
  const pageSize = 10;
  const from = (page - 1) * pageSize; // - 1 makes sure that we index starting at 0
  const to = from + pageSize - 1; // take the starting index and calculate the inclusive end index for 10 records

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  let plantsQuery = supabase
    .from("plants")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  if (healthFilter) {
    plantsQuery = plantsQuery.eq("health_status", healthFilter);
  }

  if (plantStatus) {
    plantsQuery = plantsQuery.eq("plant_status", plantStatus);
  }
  if (sort === "name_asc") {
    plantsQuery = plantsQuery.order("name", { ascending: true });
  }

  if (sort === "name_desc") {
    plantsQuery = plantsQuery.order("name", { ascending: false });
  }

  if (sort === "oldest") {
    plantsQuery = plantsQuery.order("started_at", { ascending: true });
  }

  if (sort === "newest") {
    plantsQuery = plantsQuery.order("started_at", { ascending: false });
  }
  plantsQuery = plantsQuery.range(from, to);
  const [
    { data: plants, error, count },
    { data: careLogs, error: careLogsError },
  ] = await Promise.all([
    plantsQuery,

    supabase
      .from("care_logs")
      .select(
        `
          plant_id,
          action_type,
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
      .order("action_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const typedCareLogs = (careLogs ?? []) as CareLogForDashboard[];

  const plantsWithCareData: PlantWithCareData[] = (
    (plants as Plant[] | null) ?? []
  ).map((plant) => {
    const plantLogs = typedCareLogs.filter((log) => log.plant_id === plant.id);
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
      most_recent_action: mostRecentCareLog?.action_type ?? null,
      recent_photo_url: recentPhotoUrl,
    };
  });

  const totalPages = Math.ceil((count ?? 0) / pageSize);
  if (totalPages > 0 && page > totalPages) {
    redirect(`/?page=${totalPages}`);
  }

  const visiblePages = Array.from(
    {
      length: Math.min(10, Math.max(0, totalPages - page - 1)),
    },
    (_, index) => page + index + 1,
  );
  return (
    <main className="min-h-screen p-4 sm:p-8 page">
      <div className="mx-auto max-w-5xl">
        <div
          className="flex items-start justify-between gap-3 rounded border border-white/30 p-4 shadow-sm"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            backgroundColor: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <FilterForm
            healthFilter={healthFilter}
            statusFilter={plantStatus}
            sort={sort}
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight title">
              AvoLog🌱🥑
            </h1>
            <p className="mt-3 text-lg">
              Track your plants, water changes, growth, and photos.
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
        <section className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plantsWithCareData.map((plant) => (
            <div
              key={plant.id}
              className="flex h-full min-h-[28rem] flex-col rounded border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{
                background:
                  "linear-gradient(147deg, #9d772d, #8d6b29, #a78542,#b19257,#9d772d,#5e471b)",
              }}
            >
              <LoadingLink
                href={`/plants/${plant.id}`}
                className="block flex-1 text-white"
                contentClassName="block h-full"
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

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-block rounded px-2 py-1 fs-1 ${
                      plant.is_private
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {plant.is_private ? "🔒 Private" : "🌍 Public"}
                  </span>
                  <span className="inline-block rounded bg-white/70 px-2 py-1 text-inline-block rounded px-2 py-1 fs-1 text-[#4a2c14]">
                    {plant.in_soil ? "🪴 In soil" : "💧 In water"}
                  </span>
                  <span
                    className={`inline-block rounded px-2 py-1 ${
                      healthStatusStyles[plant.health_status]
                    }`}
                  >
                    {toTitleCase(plant.health_status)}
                  </span>{" "}
                  <span
                    className={`inline-block rounded px-2 py-1 ${
                      plantStatusStyles[plant.plant_status]
                    }`}
                  >
                    {toTitleCase(plant.plant_status)}
                  </span>
                </div>

                <p className="mt-3">
                  Last cared:{" "}
                  {plant.last_care_date
                    ? formatDate(plant.last_care_date)
                    : "No care logs yet"}
                </p>

                <p>
                  Last care type:{" "}
                  {plant.most_recent_action
                    ? toTitleCase(plant.most_recent_action)
                    : "No care logs yet"}
                </p>
                <p>
                  Start Date:{" "}
                  {plant.started_at
                    ? formatDate(plant.started_at)
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

                <EditPlantButton action={updatePlant} plant={plant} />
              </div>
            </div>
          ))}
        </section>{" "}
        <div className="mt-8 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link
              className="rounded-lg bg-[#4a2c14] px-4 py-2 text-lg text-white"
              href={`/?page=${page - 1}&sort=${sort}`}
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
              href={`/?page=${page + 1}&sort=${sort}`}
            >
              ❯
            </Link>
          )}
          {page > 1 && (
            <Link
              className="rounded border p-2"
              href={`/?page=${1}&sort=${sort}`}
            >
              1
            </Link>
          )}
          {visiblePages.map((pageNumber) => (
            <Link
              className="rounded border p-2"
              key={pageNumber}
              href={`/?page=${pageNumber}&sort=${sort}`}
            >
              {pageNumber}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              className="rounded border p-2"
              href={`/?page=${totalPages}&sort=${sort}`}
            >
              Last
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
