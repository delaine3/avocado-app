"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
export type ActionResult = {
  ok: boolean;
  message: string;
};
//delete careLog
export async function deleteCareLog(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
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
//delete a plant
export async function deletePlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
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
//Update a CareLog
export async function updateCareLog(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const logId = formData.get("log_id")?.toString();
  const plantId = formData.get("plant_id")?.toString();
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;
  const photo = formData.get("photo") as File | null;
  const containerType = formData.get("container_type")?.toString();

  if (!logId || !plantId || !actionType || !actionDate) {
    return { ok: false, message: "Missing required fields." };
  }

  let photoUrl: string | null = null;

  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${plantId}/${logId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("care-log-photos")
      .upload(filePath, photo, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { ok: false, message: uploadError.message };
    }

    const { data } = supabase.storage
      .from("care-log-photos")
      .getPublicUrl(filePath);

    photoUrl = data.publicUrl;
  }

  const updatePayload: {
    action_type: string;
    action_date: string;
    notes: string | null;
    photo_url?: string | null;
  } = {
    action_type: actionType,
    action_date: actionDate,
    notes,
  };

  if (photoUrl) {
    updatePayload.photo_url = photoUrl;
  }

  const { error } = await supabase
    .from("care_logs")
    .update(updatePayload)
    .eq("id", Number(logId));

  if (error) {
    return { ok: false, message: error.message };
  }
  if (actionType === "repotted" && containerType) {
    const { error: plantUpdateError } = await supabase
      .from("plants")
      .update({
        container_type: containerType,
        stage: "potted",
      })
      .eq("id", Number(plantId));

    if (plantUpdateError) {
      throw new Error(plantUpdateError.message);
    }
  }
  revalidatePath(`/plants/${plantId}`);

  return { ok: true, message: "Care log updated." };
}

//Update a plant
export async function updatePlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const plantId = formData.get("plant_id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const startedAt = formData.get("started_at")?.toString() || null;
  const stage = formData.get("stage")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const containerType = formData.get("container_type")?.toString().trim();
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

//Create Care Log for all plants
export async function createCareLogForAllPlants(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!actionType || !actionDate) {
    return { ok: false, message: "Log type and date are required." };
  }

  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("id");

  if (plantsError) {
    return { ok: false, message: plantsError.message };
  }

  if (!plants || plants.length === 0) {
    return { ok: false, message: "No plants found." };
  }

  const logsToInsert = plants.map((plant) => ({
    plant_id: plant.id,
    action_type: actionType,
    action_date: actionDate,
    notes,
    user_id: user.id,
  }));

  const { error } = await supabase.from("care_logs").insert(logsToInsert);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  for (const plant of plants) {
    revalidatePath(`/plants/${plant.id}`);
  }

  return {
    ok: true,
    message: `Care log added to ${plants.length} plants.`,
  };
}

//Create Care Log
export async function createCareLog(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }
  const plantId = formData.get("plant_id")?.toString();
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;
  const photo = formData.get("photo") as File | null;
  const containerType =
    formData.get("container_type")?.toString().trim() || null;
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
    user_id: user.id,
  });
  if (error) {
    throw new Error(error.message);
  }
  if (actionType === "repotted" && containerType) {
    const { error: plantUpdateError } = await supabase
      .from("plants")
      .update({
        container_type: containerType,
        stage: "potted",
      })
      .eq("id", Number(plantId));

    if (plantUpdateError) {
      throw new Error(plantUpdateError.message);
    }
  }
  revalidatePath(`/plants/${plantId}`);
  redirect(`/plants/${plantId}`);
}
