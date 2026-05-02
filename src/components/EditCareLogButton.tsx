"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import type { ActionResult } from "../app/actions/plant-actions";
import CompressedImageInput from "./CompressedImageInput";

type EditCareLogButtonProps = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  log: {
    id: number;
    plant_id: number;
    plant_name: string;
    plant_stage: string;
    action_type: string;
    action_date: string;
    container_type: string;
    notes: string | null;
    label?: string | null;
    icon?: boolean | true;
    photo_url?: string | null;
  };
};

export default function EditCareLogButton({
  action,
  log,
}: EditCareLogButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState("");

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
        {log.icon ? <Pencil size={16} /> : log.label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 md:py-10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Edit Care Log</h2>

            <p className="mt-2 ">
              Update
              <span style={{ color: "#5e6c20" }} className="font-semibold">
                {log.plant_name}
              </span>
              🥑
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="log_id" value={log.id} />
              <input type="hidden" name="plant_id" value={log.plant_id} />

              <div>
                <label
                  htmlFor={`action_type_${log.id}`}
                  className="mb-2 block  font-medium"
                >
                  Log Type
                </label>
                <select
                  id={`action_type_${log.id}`}
                  name="action_type"
                  onChange={(e) => setSelectedActionType(e.target.value)}
                  defaultValue={log.action_type}
                  required
                  className="w-full rounded border px-4 py-3 outline-none"
                >
                  <option value="water_change">Water Change</option>
                  <option value="root_growth">Root Growth</option>
                  <option value="leaf_growth">Leaf Growth</option>
                  <option value="seed_crack">Seed Crack</option>
                  <option value="general_update">General Update</option>
                  <option value="repotted">Repotted</option>
                </select>
              </div>
              {selectedActionType === "repotted" && (
                <div>
                  <label className="mb-2 block font-medium">
                    New Container Type
                  </label>

                  <select
                    name="container_type"
                    className="w-full rounded border px-4 py-3 outline-none"
                    defaultValue=""
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
              )}
              <div>
                <label
                  htmlFor={`action_date_${log.id}`}
                  className="mb-2 block  font-medium"
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
              <div>
                <span>Keep this log private?</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_private"
                    className="h-8 w-8"
                  />
                </label>
                <div className="text-stone-500 ">
                  If this box is checked, the plant will not appear in the feed
                  and nobody will be able to view it but you.
                </div>
              </div>
              <div>
                <label
                  htmlFor={`notes_${log.id}`}
                  className="mb-2 block  font-medium"
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
                <label className="mb-2 block  font-medium">Photo Journal</label>
                <CompressedImageInput id="photo" name="photo" />
              </div>
              {log.photo_url && (
                <img
                  src={log.photo_url}
                  alt="Current care log photo"
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              )}
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
