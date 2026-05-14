"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResult } from "../app/actions/plant-actions";
import PlantStageTypeahead from "./PlantStageTypeahead";
import ContainerTypeahead from "./ContainerTypeahead";
import Spinner from "./Spinner";

type Props = {
  parentPlantId: number;
  parentPlantName: string;
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
};

export default function CreateChildPlantButton({
  parentPlantId,
  parentPlantName,
  action,
}: Props) {
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
        className="create-button"
      >
        Create Child Plant
      </button>

      {open && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!pending) setOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded p-4 shadow-2xl sm:p-6"
            style={{ backgroundColor: "#fffaf1" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Create Child Plant</h2>
            <p className="mt-2 text-sm text-stone-600">
              Split a new plant from {parentPlantName}.
            </p>

            <form action={formAction} className="mt-5 space-y-4">
              <input
                type="hidden"
                name="parent_plant_id"
                value={parentPlantId}
              />

              <div>
                <label className="mb-2 block font-medium">Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full rounded border px-4 py-3 outline-none"
                  placeholder="Gemma"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Started Date</label>
                <input
                  name="started_at"
                  type="date"
                  className="w-full rounded border px-4 py-3 outline-none"
                />
              </div>

              <PlantStageTypeahead defaultValue="" />

              <div>
                <label className="mb-2 block font-medium">Location</label>
                <input
                  name="location"
                  type="text"
                  className="w-full rounded border px-4 py-3 outline-none"
                  placeholder="Laundry room, kitchen, windowsill..."
                />
              </div>

              <ContainerTypeahead />

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="in_soil" className="h-6 w-6" />
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
                    className="h-6 w-6"
                  />
                  <span className="font-medium">Keep this plant private?</span>
                </label>
              </div>

              <div>
                <label className="mb-2 block font-medium">Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full rounded border px-4 py-3 outline-none"
                  placeholder={`Split from ${parentPlantName}.`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={pending}
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
                  <span className="inline-flex items-center justify-center gap-2">
                    {pending && <Spinner />}
                    {pending ? "Creating..." : "Create Child Plant"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
