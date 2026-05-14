"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import type { ActionResult } from "../../actions/plant-actions";

export async function createChildPlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be logged in." };
  }

  const parentPlantId = formData.get("parent_plant_id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const startedAt = formData.get("started_at")?.toString() || null;
  const stage = formData.get("stage")?.toString().trim();
  const location = formData.get("location")?.toString().trim() || null;
  const containerType =
    formData.get("container_type")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;
  const isPrivate = formData.get("is_private") === "on";
  const inSoil = formData.get("in_soil") === "on";

  if (!parentPlantId) {
    return { ok: false, message: "Parent plant is missing." };
  }

  if (!name) {
    return { ok: false, message: "Child plant name is required." };
  }

  if (!stage) {
    return { ok: false, message: "Child plant stage is required." };
  }

  const { data: parentPlant, error: parentError } = await supabase
    .from("plants")
    .select("id, user_id")
    .eq("id", Number(parentPlantId))
    .single();

  if (parentError || !parentPlant) {
    return { ok: false, message: "Parent plant not found." };
  }

  if (parentPlant.user_id !== user.id) {
    return { ok: false, message: "You can only split your own plants." };
  }

  const { error } = await supabase.from("plants").insert({
    name,
    started_at: startedAt,
    stage,
    location,
    container_type: containerType,
    notes,
    user_id: user.id,
    is_private: isPrivate,
    in_soil: inSoil,
    parent_plant_id: Number(parentPlantId),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/plants/${parentPlantId}`);

  return { ok: true, message: `${name} was created as a child plant.` };
}
export async function createPlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be logged in." };
  }

  const name = formData.get("name")?.toString().trim();
  const started_at = formData.get("started_at")?.toString() || null;
  const stage = formData.get("stage")?.toString().trim();
  const location = formData.get("location")?.toString().trim() || null;
  const container_type =
    formData.get("container_type")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;
  const is_private = formData.get("is_private") === "on";
  const in_soil = formData.get("in_soil") === "on";
  const parent_plant_id_raw = formData.get("parent_plant_id")?.toString();
  const parent_plant_id = parent_plant_id_raw
    ? Number(parent_plant_id_raw)
    : null;
  if (!name) {
    return { ok: false, message: "Plant name is required." };
  }

  if (!stage) {
    return { ok: false, message: "Plant stage is required." };
  }

  const { error } = await supabase.from("plants").insert({
    name,
    started_at,
    stage,
    location,
    container_type,
    notes,
    user_id: user.id,
    is_private,
    in_soil,
    parent_plant_id,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  redirect("/");
}
