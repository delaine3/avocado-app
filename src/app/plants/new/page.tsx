import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../lib/supabase-server";
import Link from "next/link";

async function createPlant(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();
  const name = formData.get("name")?.toString().trim();
  const started_at = formData.get("started_at")?.toString() || null;
  const stage = formData.get("stage")?.toString().trim();
  const location = formData.get("location")?.toString().trim() || null;
  const container_type = formData.get("container_type")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!name || !stage) {
    throw new Error("Name and stage are required.");
  }

  const { error } = await supabase.from("plants").insert({
    name,
    started_at: started_at || null,
    stage,
    location,
    container_type,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/");
}

export default function NewPlantPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10  page">
      <Link href="/" className="  underline underline-offset-4">
        ← Back to dashboard
      </Link>
      <div className="page-header">
        <h1 className="title">Add a New Avocado</h1>
        <p className="">
          Log a new seedling, rescue case, or future tree in the squad.
        </p>
      </div>
      <form action={createPlant} className="rounded-2xl field-form">
        <div>
          <label htmlFor="name" className="mb-2 block  font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
            placeholder="Earth"
          />
        </div>

        <div>
          <label htmlFor="started_at" className="mb-2 block  font-medium">
            Start Date
          </label>
          <input
            id="started_at"
            name="started_at"
            type="date"
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
          />
        </div>

        <div>
          <label htmlFor="stage" className="mb-2 block  font-medium">
            Stage
          </label>
          <select
            id="stage"
            name="stage"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
            defaultValue="dormant"
          >
            <option value="dormant">Dormant</option>
            <option value="cracked">Cracked</option>
            <option value="rooting">Rooting</option>
            <option value="stem_emerging">Stem Emerging</option>
            <option value="leafing">Leafing</option>
            <option value="potted">Potted</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block  font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
            placeholder="Sunroom"
          />
        </div>

        <div>
          <label htmlFor="container_type" className="mb-2 block  font-medium">
            Container Type
          </label>
          <input
            id="container_type"
            name="container_type"
            type="text"
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
            placeholder="Water jar"
          />
        </div>

        <div>
          <label htmlFor="notes" className="mb-2 block  font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
            placeholder="Newest seed with intact coat and suspiciously calm energy."
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="submit-button">
            Save Plant
          </button>

          <a href="/" className="cancel-button">
            Cancel
          </a>
        </div>
      </form>
    </main>
  );
}
