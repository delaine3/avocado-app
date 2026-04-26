"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import type { ActionResult } from "../app/actions/plant-actions";

type EditPlantButtonProps = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  plant: {
    id: number;
    name: string;
    started_at: string | null;
    stage: string | null;
    location: string | null;
    container_type: string | null;
    notes: string | null;
    label?: string | null;
    icon?: boolean | false;
  };
};

export default function EditPlantButton({
  action,
  plant,
}: EditPlantButtonProps) {
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message);
      setOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Edit plant"
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 my-2  font-medium text-blue-700 transition hover:bg-blue-50"
        style={{ color: "#586b20", backgroundColor: "#a5b760" }}
      >
        <Pencil size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 md:py-10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Edit Plant</h3>

            <p className="mt-2 ">Update your avocado profile.</p>

            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="plant_id" value={plant.id} />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`name_${plant.id}`}
                    className="mb-2 block  font-medium"
                  >
                    Name
                  </label>
                  <input
                    id={`name_${plant.id}`}
                    name="name"
                    type="text"
                    defaultValue={plant.name}
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`started_at_${plant.id}`}
                    className="mb-2 block  font-medium"
                  >
                    Started Date
                  </label>
                  <input
                    id={`started_at_${plant.id}`}
                    name="started_at"
                    type="date"
                    defaultValue={plant.started_at ?? ""}
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`stage_${plant.id}`}
                    className="mb-2 block  font-medium"
                  >
                    Stage
                  </label>

                  <select
                    id="stage"
                    name="stage"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none ring-0"
                    defaultValue={plant.stage ?? ""}
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
                  <label
                    htmlFor={`location_${plant.id}`}
                    className="mb-2 block  font-medium"
                  >
                    Location
                  </label>
                  <input
                    id={`location_${plant.id}`}
                    name="location"
                    type="text"
                    defaultValue={plant.location ?? ""}
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                    placeholder="kitchen, bedroom, windowsill..."
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`container_type_${plant.id}`}
                  className="mb-2 block  font-medium"
                >
                  Container Type
                </label>
                <input
                  id={`container_type_${plant.id}`}
                  name="container_type"
                  type="text"
                  defaultValue={plant.container_type ?? ""}
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="glass jar, vase, water glass..."
                />
              </div>

              <div>
                <label
                  htmlFor={`notes_${plant.id}`}
                  className="mb-2 block  font-medium"
                >
                  Notes
                </label>
                <textarea
                  id={`notes_${plant.id}`}
                  name="notes"
                  rows={5}
                  defaultValue={plant.notes ?? ""}
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="Earth is recovering, Future Tree is cracking, Flora is thriving..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="submit-button"
                >
                  {pending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
