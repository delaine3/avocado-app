"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import type { ActionResult } from "../../actions/plant-actions";

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
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  redirect("/");
}
