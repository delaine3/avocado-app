"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import type { ActionResult } from "../app/actions/plant-actions";
import PlantStageTypeahead from "./PlantStageTypeahead";
import ContainerTypeahead from "./ContainerTypeahead";
import { Plant } from "../types/plant";
import Spinner from "./Spinner";
import SubmitButton from "./SubmitButton";

type EditPlantButtonProps = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  plant: Plant;
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
        className="edit-button"
      >
        <Pencil size={16} />
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded p-4 shadow-2xl sm:p-6"
            style={{ backgroundColor: "#fffaf1" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold sm:text-xl">Edit Plant</h3>

            <p className="mt-2 text-sm sm:text-base">
              Update your plant profile.
            </p>

            <form action={formAction} className="mt-5 space-y-4 sm:mt-6">
              <input type="hidden" name="plant_id" value={plant.id} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`name_${plant.id}`}
                    className="mb-2 block font-medium"
                  >
                    Name
                  </label>
                  <input
                    id={`name_${plant.id}`}
                    name="name"
                    type="text"
                    defaultValue={plant.name}
                    required
                    className="w-full rounded border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`started_at_${plant.id}`}
                    className="mb-2 block font-medium"
                  >
                    Started Date
                  </label>
                  <input
                    id={`started_at_${plant.id}`}
                    name="started_at"
                    type="date"
                    defaultValue={plant.started_at ?? ""}
                    className="w-full rounded border px-4 py-3 outline-none"
                  />
                </div>

                <PlantStageTypeahead defaultValue={plant.stage} />

                <div>
                  <label
                    htmlFor={`location_${plant.id}`}
                    className="mb-2 block font-medium"
                  >
                    Location
                  </label>
                  <input
                    id={`location_${plant.id}`}
                    name="location"
                    type="text"
                    defaultValue={plant.location ?? ""}
                    className="w-full rounded border px-4 py-3 outline-none"
                    placeholder="Kitchen, bedroom, windowsill..."
                  />
                </div>
              </div>

              <ContainerTypeahead defaultValue={plant.container_type} />

              <div>
                <label
                  htmlFor={`notes_${plant.id}`}
                  className="mb-2 block font-medium"
                >
                  Notes
                </label>
                <textarea
                  id={`notes_${plant.id}`}
                  name="notes"
                  rows={5}
                  defaultValue={plant.notes ?? ""}
                  className="w-full rounded border px-4 py-3 outline-none"
                  placeholder="Earth is recovering, Future Tree is cracking, Flora is thriving..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="in_soil"
                    defaultChecked={plant.in_soil}
                    className="h-6 w-6"
                  />
                  <span className="font-medium">This plant is in soil</span>
                </label>

                <p className="mt-2 text-sm text-stone-500">
                  Soil plants get watered. Water-propagation plants get water
                  changes.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_private"
                    defaultChecked={plant.is_private}
                    className="h-6 w-6"
                  />
                  <span className="font-medium">Keep this plant private?</span>
                </label>

                <p className="mt-2 text-sm text-stone-500">
                  If this box is checked, this plant and its care logs will not
                  appear in the feed.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cancel-button w-full sm:w-auto"
                  disabled={pending}
                >
                  Cancel
                </button>
                <SubmitButton
                  idleText="Save Changes"
                  pendingText="Saving Plant..."
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
