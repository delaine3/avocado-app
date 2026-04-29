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
    action_type: string;
    action_date: string;
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
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 my-2  font-medium"
        style={{ color: "#586b20", backgroundColor: "#a5b760" }}
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
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
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
                  defaultValue={log.action_type}
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                >
                  <option value="water_change">Water Change</option>
                  <option value="root_growth">Root Growth</option>
                  <option value="leaf_growth">Leaf Growth</option>
                  <option value="seed_crack">Seed Crack</option>
                  <option value="general_update">General Update</option>
                </select>
              </div>

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
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />
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
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="Roots looked brighter, crack widened, stem tilted upward..."
                />
              </div>
              <div className="rounded-2xl">
                <label className="mb-2 block  font-medium">Photo Journal</label>
                <CompressedImageInput id="photo" name="photo" />
              </div>
              {log.photo_url && (
                <img
                  src={log.photo_url}
                  alt="Current care log photo"
                  className="mb-3 h-40 w-full rounded-2xl object-cover"
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
