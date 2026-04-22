"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export type ActionResult = {
  ok: boolean;
  message: string;
};

export async function deleteCareLog(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();

  const logId = formData.get("log_id")?.toString();
  const plantId = formData.get("plant_id")?.toString();

  if (!logId || !plantId) {
    return { ok: false, message: "Missing log ID or plant ID." };
  }

  const { error } = await supabase
    .from("care_logs")
    .delete()
    .eq("id", Number(logId));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/plants/${plantId}`);

  return { ok: true, message: "Care log deleted." };
}

export async function deletePlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();

  const plantId = formData.get("plant_id")?.toString();

  if (!plantId) {
    return { ok: false, message: "Missing plant ID." };
  }

  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", Number(plantId));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/plants/${plantId}`);

  return { ok: true, message: "Plant deleted." };
}

export async function updateCareLog(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();

  const logId = formData.get("log_id")?.toString();
  const plantId = formData.get("plant_id")?.toString();
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!logId || !plantId || !actionType || !actionDate) {
    return { ok: false, message: "Missing required fields." };
  }

  const { error } = await supabase
    .from("care_logs")
    .update({
      action_type: actionType,
      action_date: actionDate,
      notes,
    })
    .eq("id", Number(logId));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/plants/${plantId}`);

  return { ok: true, message: "Care log updated." };
}
export async function updatePlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();

  const plantId = formData.get("plant_id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const startedAt = formData.get("started_at")?.toString() || null;
  const stage = formData.get("stage")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const containerType =
    formData.get("container_type")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!plantId || !name) {
    return { ok: false, message: "Plant ID and name are required." };
  }

  const { error } = await supabase
    .from("plants")
    .update({
      name,
      started_at: startedAt,
      stage,
      location,
      container_type: containerType,
      notes,
    })
    .eq("id", Number(plantId));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/plants/${plantId}`);

  return { ok: true, message: "Plant updated." };
}
