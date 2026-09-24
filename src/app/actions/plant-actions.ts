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
  const isPrivate = formData.get("is_private") === "on";

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
    is_private: boolean;
    photo_url?: string | null;
  } = {
    action_type: actionType,
    action_date: actionDate,
    notes,
    is_private: isPrivate,
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
      return { ok: false, message: plantUpdateError.message };
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
  const containerType =
    formData.get("container_type")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;
  const isPrivate = formData.get("is_private") === "on";
  const inSoil = formData.get("in_soil") === "on";
  const healthStatus = formData.get("health_status")?.toString().trim();
  var plantStatus = formData.get("plant_status")?.toString().trim();

  const validHealthStatuses = ["healthy", "struggling", "recovering", "dead"];

  const validPlantStatuses = ["active", "gifted", "archived"];

  if (!healthStatus || !validHealthStatuses.includes(healthStatus)) {
    return { ok: false, message: "Invalid health status" };
  }

  if (!plantStatus || !validPlantStatuses.includes(plantStatus)) {
    return { ok: false, message: "Invalid plant status" };
  }
  if (!plantId || !name) {
    return { ok: false, message: "Plant ID and name are required." };
  }
  if (healthStatus == "dead") {
    plantStatus = "archived";
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
      is_private: isPrivate,
      in_soil: inSoil,
      health_status: healthStatus,
      plant_status: plantStatus,
    })
    .eq("id", Number(plantId));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/plants/${plantId}`);
  revalidatePath("/feed");

  return { ok: true, message: "Plant updated." };
}
function containerIsSoil(containerType: string | null) {
  if (!containerType) return false;

  return [
    "small_pot",
    "medium_pot",
    "large_pot",
    "terracotta_pot",
    "ceramic_pot",
    "plastic_pot",
    "planter_box",
    "grow_bag",
    "outdoor_ground",
    "raised_bed",
  ].includes(containerType);
}

function stageFromContainer(containerType: string | null) {
  if (!containerType) return null;

  if (containerType === "outdoor_ground" || containerType === "raised_bed") {
    return "outdoor";
  }

  if (containerIsSoil(containerType)) {
    return "potted";
  }

  return null;
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
    return { ok: false, message: "You must be logged in." };
  }

  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;
  const isPrivate = formData.get("is_private") === "on";
  const careGroup = formData.get("care_group")?.toString() || "all";

  if (!actionType || !actionDate) {
    return { ok: false, message: "Log type and date are required." };
  }

  let plantsQuery = supabase.from("plants").select("id").eq("user_id", user.id);

  if (careGroup === "soil") {
    plantsQuery = plantsQuery.eq("in_soil", true);
  }

  if (careGroup === "water") {
    plantsQuery = plantsQuery.eq("in_soil", false);
  }

  const { data: plants, error: plantsError } = await plantsQuery;

  if (plantsError) {
    return { ok: false, message: plantsError.message };
  }

  if (!plants || plants.length === 0) {
    return {
      ok: false,
      message:
        careGroup === "soil"
          ? "No soil plants found."
          : careGroup === "water"
            ? "No water-propagation plants found."
            : "No plants found.",
    };
  }

  const logsToInsert = plants.map((plant) => ({
    plant_id: plant.id,
    user_id: user.id,
    action_type: actionType,
    action_date: actionDate,
    is_private: isPrivate,
    notes,
  }));

  const { error } = await supabase.from("care_logs").insert(logsToInsert);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/feed");

  for (const plant of plants) {
    revalidatePath(`/plants/${plant.id}`);
  }

  return {
    ok: true,
    message: `Care log added to ${plants.length} plants.`,
  };
}

//Create Care Log
export async function createCareLog(
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

  const plantId = formData.get("plant_id")?.toString();
  const actionType = formData.get("action_type")?.toString();
  const actionDate = formData.get("action_date")?.toString();
  const notes = formData.get("notes")?.toString().trim() || null;
  const containerType =
    formData.get("container_type")?.toString().trim() || null;
  const isPrivate = formData.get("is_private") === "on";

  const photos = formData
    .getAll("photos")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!plantId || !actionType || !actionDate) {
    return {
      ok: false,
      message: "Plant ID, log type, and care date are required.",
    };
  }

  const { data: createdLog, error } = await supabase
    .from("care_logs")
    .insert({
      plant_id: Number(plantId),
      user_id: user.id,
      action_type: actionType,
      action_date: actionDate,
      notes,
      is_private: isPrivate,
      photo_url: null,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  const uploadedPhotos: {
    care_log_id: number;
    user_id: string;
    photo_url: string;
    storage_path: string;
  }[] = [];

  for (const [index, photo] of photos.entries()) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${plantId}/${createdLog.id}-${Date.now()}-${index}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("care-log-photos")
      .upload(filePath, photo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { ok: false, message: uploadError.message };
    }

    const { data } = supabase.storage
      .from("care-log-photos")
      .getPublicUrl(filePath);

    uploadedPhotos.push({
      care_log_id: createdLog.id,
      user_id: user.id,
      photo_url: data.publicUrl,
      storage_path: filePath,
    });
  }

  if (uploadedPhotos.length > 0) {
    const { error: photosError } = await supabase
      .from("care_log_photos")
      .insert(uploadedPhotos);

    if (photosError) {
      return { ok: false, message: photosError.message };
    }

    const { error: updatePhotoError } = await supabase
      .from("care_logs")
      .update({
        photo_url: uploadedPhotos[0].photo_url,
      })
      .eq("id", createdLog.id);

    if (updatePhotoError) {
      return { ok: false, message: updatePhotoError.message };
    }
  }

  if (actionType === "repotted" && containerType) {
    const nextStage = stageFromContainer(containerType);

    const plantUpdatePayload: {
      container_type: string;
      in_soil: boolean;
      stage?: string;
    } = {
      container_type: containerType,
      in_soil: containerIsSoil(containerType),
    };

    if (nextStage) {
      plantUpdatePayload.stage = nextStage;
    }

    const { error: plantUpdateError } = await supabase
      .from("plants")
      .update(plantUpdatePayload)
      .eq("id", Number(plantId));

    if (plantUpdateError) {
      return { ok: false, message: plantUpdateError.message };
    }
  }

  revalidatePath(`/plants/${plantId}`);
  revalidatePath("/");
  revalidatePath("/feed");

  redirect(`/plants/${plantId}`);
}

//likes
export async function toggleCareLogLike(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const careLogId = formData.get("care_log_id")?.toString();

  if (!careLogId) {
    return { ok: false, message: "Missing care log ID." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be logged in." };
  }

  const { data: existingLike, error: existingLikeError } = await supabase
    .from("care_log_likes")
    .select("id")
    .eq("care_log_id", Number(careLogId))
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLikeError) {
    return { ok: false, message: existingLikeError.message };
  }

  if (existingLike) {
    const { error } = await supabase
      .from("care_log_likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/feed");
    return { ok: true, message: "Like removed." };
  }

  const { error } = await supabase.from("care_log_likes").insert({
    care_log_id: Number(careLogId),
    user_id: user.id,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/feed");
  return { ok: true, message: "Liked." };
}
//Comments
export async function createCareLogComment(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const careLogId = formData.get("care_log_id")?.toString();
  const body = formData.get("body")?.toString().trim();

  if (!careLogId || !body) {
    return { ok: false, message: "Comment cannot be empty." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be logged in." };
  }

  const { error } = await supabase.from("care_log_comments").insert({
    care_log_id: Number(careLogId),
    user_id: user.id,
    body,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/feed");

  return { ok: true, message: "Comment added." };
}
