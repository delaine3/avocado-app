"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import type { ActionResult } from "../app/actions/plant-actions";
import CompressedImageInput from "./CompressedImageInput";
import { CareLog } from "../types/care-log";

type EditCareLogButtonProps = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  log: CareLog;
};

export default function EditCareLogButton({
  action,
  log,
}: EditCareLogButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState(
    log.action_type ?? "",
  );

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
        className="edit-button"
        aria-label="Edit care log"
        title="Edit care log"
      >
        <Pencil size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6 md:py-10"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded bg-white p-4 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold sm:text-xl">Edit Care Log</h2>

            <p className="mt-2 text-sm sm:text-base">
              Update{" "}
              <span style={{ color: "#5e6c20" }} className="font-semibold">
                {log.plant_name}
              </span>{" "}
              🥑
            </p>

            <form action={formAction} className="mt-5 space-y-4 sm:mt-6">
              <input type="hidden" name="log_id" value={log.id} />
              <input type="hidden" name="plant_id" value={log.plant_id} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`action_type_${log.id}`}
                    className="mb-2 block font-medium"
                  >
                    Log Type
                  </label>
                  <select
                    id={`action_type_${log.id}`}
                    name="action_type"
                    onChange={(event) =>
                      setSelectedActionType(event.target.value)
                    }
                    defaultValue={log.action_type}
                    required
                    className="w-full rounded border px-4 py-3 outline-none"
                  >
                    <option value="water_change">Water Change</option>
                    <option value="watered">Watered</option>
                    <option value="root_growth">Root Growth</option>
                    <option value="stem_growth">Stem Growth</option>
                    <option value="leaf_growth">Leaf Growth</option>
                    <option value="seed_crack">Seed Crack</option>
                    <option value="fertilized">Fertilized</option>
                    <option value="pruned">Pruned</option>
                    <option value="pest_check">Pest Check</option>
                    <option value="sunlight_adjusted">Sunlight Adjusted</option>
                    <option value="moved_location">Moved Location</option>
                    <option value="outdoor_transplant">
                      Outdoor Transplant
                    </option>
                    <option value="weather_note">Weather Note</option>
                    <option value="mulched">Mulched</option>
                    <option value="flowering">Flowering</option>
                    <option value="fruiting">Fruiting</option>
                    <option value="harvest">Harvest</option>
                    <option value="general_update">General Update</option>
                    <option value="repotted">Repotted</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`action_date_${log.id}`}
                    className="mb-2 block font-medium"
                  >
                    Date
                  </label>
                  <input
                    id={`action_date_${log.id}`}
                    name="action_date"
                    type="date"
                    defaultValue={log.action_date}
                    required
                    className="w-full rounded border px-4 py-3 outline-none"
                  />
                </div>
              </div>

              {selectedActionType === "repotted" && (
                <div>
                  <label className="mb-2 block font-medium">
                    New Container Type
                  </label>

                  <select
                    name="container_type"
                    className="w-full rounded border px-4 py-3 outline-none"
                    defaultValue={log.container_type ?? ""}
                  >
                    <option value="" disabled>
                      Select new container
                    </option>
                    <option value="water_jar">Water Jar</option>
                    <option value="glass_vase">Glass Vase</option>
                    <option value="small_pot">Small Pot</option>
                    <option value="medium_pot">Medium Pot</option>
                    <option value="large_pot">Large Pot</option>
                    <option value="terracotta_pot">Terracotta Pot</option>
                    <option value="ceramic_pot">Ceramic Pot</option>
                    <option value="plastic_pot">Plastic Pot</option>
                    <option value="planter_box">Planter Box</option>
                    <option value="grow_bag">Grow Bag</option>
                    <option value="outdoor_ground">Outdoor Ground</option>
                    <option value="raised_bed">Raised Bed</option>
                  </select>
                </div>
              )}

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_private"
                    defaultChecked={log.is_private}
                    className="h-6 w-6 shrink-0"
                  />
                  <span className="font-medium">Keep this log private?</span>
                </label>

                <p className="mt-2 text-sm text-stone-500">
                  If this box is checked, this care log will not appear in the
                  feed and nobody will be able to view it but you.
                </p>
              </div>

              <div>
                <label
                  htmlFor={`notes_${log.id}`}
                  className="mb-2 block font-medium"
                >
                  Notes
                </label>
                <textarea
                  id={`notes_${log.id}`}
                  name="notes"
                  defaultValue={log.notes ?? ""}
                  rows={4}
                  className="w-full rounded border px-4 py-3 outline-none"
                  placeholder="Roots looked brighter, crack widened, stem tilted upward..."
                />
              </div>

              <div className="rounded">
                <label className="mb-2 block font-medium">Photo Journal</label>
                <CompressedImageInput id={`photo_${log.id}`} name="photo" />
              </div>

              {log.photo_url && (
                <div className="rounded bg-black/5 p-2">
                  <p className="mb-2 text-sm font-medium text-stone-600">
                    Current photo
                  </p>
                  <img
                    src={log.photo_url}
                    alt="Current care log photo"
                    className="max-h-72 w-full rounded object-contain"
                  />
                </div>
              )}

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
