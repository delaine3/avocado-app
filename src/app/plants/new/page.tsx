import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import Link from "next/link";
import PlantStageTypeahead from "@/src/components/PlantStageTypeahead";
import ContainerTypeahead from "@/src/components/ContainerTypeahead";
import SubmitButton from "@/src/components/SubmitButton";

async function createPlant(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
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

  if (!name || !stage) {
    throw new Error("Name and stage are required.");
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
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/");
}

export default function NewPlantPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 page">
      <div className="page-header">
        <h1 className="title">Add a New Plant</h1>
        <p>Log a new seedling, rescue case, or future tree in the squad.</p>
      </div>

      <form action={createPlant} className="rounded field-form">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded border px-4 py-3 outline-none ring-0"
            placeholder="Earth"
          />
        </div>

        <div>
          <label htmlFor="started_at" className="mb-2 block font-medium">
            Start Date
          </label>
          <input
            id="started_at"
            name="started_at"
            type="date"
            className="w-full rounded border px-4 py-3 outline-none ring-0"
          />
        </div>

        <PlantStageTypeahead defaultValue="" />

        <div>
          <label htmlFor="location" className="mb-2 block font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="w-full rounded border px-4 py-3 outline-none ring-0"
            placeholder="Sunroom"
          />
        </div>

        <ContainerTypeahead />

        <div>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="in_soil" className="h-6 w-6" />
            <span className="font-medium">This plant is in soil</span>
          </label>

          <p className="mt-2 text-sm text-stone-500">
            Soil plants get watered. Water-propagation plants get water changes.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="is_private" className="h-6 w-6" />
            <span className="font-medium">Keep this plant private?</span>
          </label>

          <p className="mt-2 text-sm text-stone-500">
            If this box is checked, the plant will not appear in the feed and
            nobody will be able to view it but you.
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="mb-2 block font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="w-full rounded border px-4 py-3 outline-none ring-0"
            placeholder="Newest seed with intact coat and suspiciously calm energy."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <SubmitButton idleText="Save Plant" pendingText="Saving Plant..." />

          <Link href="/" className="cancel-button text-center">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
