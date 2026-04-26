import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "../../../lib/supabase";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
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
import { toTitleCase } from "../../utilities/format";

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function createCareLog(formData: FormData) {
  "use server";

  const supabase = createSupabaseServerClient();

  const plantId = formData.get("plant_id")?.toString();
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;
  const photo = formData.get("photo") as File | null;

  if (!plantId || !actionType || !actionDate) {
    throw new Error("Plant ID, action type, and action date are required.");
  }

  let photoUrl: string | null = null;

  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${plantId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("care-log-photos")
      .upload(filePath, photo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("care-log-photos")
      .getPublicUrl(filePath);

    photoUrl = data.publicUrl;
  }

  const { error } = await supabase.from("care_logs").insert({
    plant_id: Number(plantId),
    action_type: actionType,
    action_date: actionDate,
    notes,
    photo_url: photoUrl,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/plants/${plantId}`);
  redirect(`/plants/${plantId}`);
}

function getLogTypeMeta(actionType: string) {
  switch (actionType) {
    case "water_change":
      return {
        label: "Water Change",
        className: "bg-[#d9ecff] text-[#1f5f99]",
        icon: "💧",
      };

    case "root_growth":
      return {
        label: "Root Growth",
        className: "bg-[#e7d4bf] text-[#6b4226]",
        icon: "🤎",
      };

    case "leaf_growth":
      return {
        label: "Leaf Growth",
        className: "bg-[#dff2c2] text-[#3d6b1f]",
        icon: "🍃",
      };

    case "seed_crack":
      return {
        label: "Seed Crack",
        className: "bg-[#f3e2b8] text-[#8a5a13]",
        icon: "🥑",
      };

    case "general_update":
      return {
        label: "General Update",
        className: "bg-[#ece7dc] text-[#5c4a34]",
        icon: "📝",
      };

    default:
      return {
        label: actionType.replaceAll("_", " "),
        className: "bg-[#f3efe6] text-[#5f5648]",
        icon: "📘",
      };
  }
}
export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  const { id } = await params;

  const [
    { data: plant, error: plantError },
    { data: careLogs, error: careLogsError },
  ] = await Promise.all([
    supabase.from("plants").select("*").eq("id", id).single(),
    supabase
      .from("care_logs")
      .select("*")
      .eq("plant_id", id)
      .order("action_date", { ascending: false }),
  ]);

  if (plantError || !plant) {
    notFound();
  }

  const typedPlant = plant as Plant;
  const typedCareLogs = (careLogs ?? []) as CareLog[];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 page">
      <Link href="/" className="  underline underline-offset-4">
        ← Back to dashboard
      </Link>
      <div className="page-header mb-6"></div>
      <div className="page-header">
        <h1 className="title"> Plant Profile</h1>

        <h1 className="title-sm">{typedPlant.name}</h1>
        <p className="">{typedPlant.notes ?? "No notes yet."}</p>
      </div>
      <div className="field-form">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <h1 className="title-sm">
            <span className="plant-label">Plant Name:</span>
            <span className="plant-name-value">{typedPlant.name}</span>
          </h1>
          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end md:ml-auto">
            <div className="mt-4 rounded-xl border border-stone-300 px-4 py-2 font-medium bg-stone-50">
              <span className="font-bold">Stage: </span>
              <span className="font-medium">
                {toTitleCase(typedPlant.stage)}
              </span>
            </div>
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
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {" "}
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Started</h2>
            <p className="mt-2 ">{typedPlant.started_at ?? "Not set"}</p>
          </div>
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="mt-2 ">{typedPlant.location ?? "Not set"}</p>
          </div>
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Container Type</h2>
            <p className="mt-2 ">{typedPlant.container_type ?? "Not set"}</p>
          </div>
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Created</h2>
            <p className="mt-2 ">
              {new Date(typedPlant.created_at).toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {" "}
          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Add Care Log</h2>

            <form action={createCareLog} className="mt-4 space-y-4">
              <input type="hidden" name="plant_id" value={typedPlant.id} />
              <div>
                <label
                  htmlFor="action_type"
                  className="mb-2 block  font-medium"
                >
                  Log Type
                </label>
                <select
                  id="action_type"
                  name="action_type"
                  required
                  defaultValue="water_change"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                >
                  <option value="water_change">Water Change</option>
                  <option value="root_growth">Root Growth</option>
                  <option value="leaf_growth">Leaf Growth</option>
                  <option value="seed_crack">Seed Crack</option>
                  <option value="general_update">General Update</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="action_date"
                  className="mb-2 block  font-medium"
                >
                  Care Date
                </label>
                <input
                  id="action_date"
                  name="action_date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  type="date"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label htmlFor="notes" className="mb-2 block  font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="Fresh water, roots looked bright white, tiny crack widening."
                />
              </div>
              <div className="rounded-2xl">
                <label className="mb-2 block  font-medium">Photo Journal</label>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>
              <button type="submit" className="submit-button">
                Save Care Log
              </button>
            </form>
          </div>
          <div className="flex h-[28rem] flex-col rounded-2xl border p-4 sm:h-[32rem] sm:p-5">
            <h2 className="text-lg font-semibold">Care History</h2>
            {careLogsError && (
              <p className="mt-3  text-red-600">
                Failed to load care logs: {careLogsError.message}
              </p>
            )}
            {typedCareLogs.length === 0 ? (
              <p className="mt-3  ">No care logs yet.</p>
            ) : (
              <div className="mt-4 flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {typedCareLogs.map((log) => {
                    const logMeta = getLogTypeMeta(log.action_type);

                    return (
                      <div
                        key={log.id}
                        className="rounded-xl p-4 space-y-2"
                        style={{ background: "rgba(37, 149, 190, 0.31)" }}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <span
                            className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:px-3 sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wide whitespace-nowrap ${logMeta.className}`}
                          >
                            <span className=" leading-none">
                              {logMeta.icon}
                            </span>
                            {logMeta.label}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <EditCareLogButton
                              action={updateCareLog}
                              log={{
                                id: log.id,
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
                        </div>
                        <div style={{ color: "#2596be" }}>
                          <p className=" font-medium ">
                            {new Date(log.action_date).toLocaleDateString()}
                          </p>
                          <p className=" ">
                            {log.notes ?? "No notes recorded."}
                          </p>
                        </div>
                        {log.photo_url && (
                          <img
                            src={log.photo_url}
                            alt={`Care log photo for ${typedPlant.name}`}
                            className="mt-3 h-56 w-full rounded-2xl object-cover sm:h-80"
                          />
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
