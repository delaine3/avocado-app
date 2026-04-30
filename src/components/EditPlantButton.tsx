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
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-4 shadow-2xl sm:p-6"
            style={{ backgroundColor: "#fffaf1" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold sm:text-xl">Edit Plant</h3>

            <p className="mt-2 text-sm sm:text-base">
              Update your avocado profile.
            </p>

            <form action={formAction} className="mt-5 space-y-4 sm:mt-6">
              <input type="hidden" name="plant_id" value={plant.id} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              {plant.stage == "potted" ? (
                <div>
                  <label className="mb-2 block font-medium">
                    New Container Type
                  </label>
                  <div className="bg-blue">{plant.container_type}</div>
                  <select
                    name="container_type"
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                    defaultValue={plant.container_type ?? ""}
                  >
                    <option value="" disabled>
                      Select new container
                    </option>
                    <option value="water_jar">Water Jar</option>
                    <option value="small_pot">Small Pot</option>
                    <option value="medium_pot">Medium Pot</option>
                    <option value="large_pot">Large Pot</option>
                  </select>
                </div>
              ) : (
                <></>
              )}

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

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cancel-button w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="submit-button w-full sm:w-auto"
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
