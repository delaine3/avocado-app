"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResult } from "../app/actions/plant-actions";

type Props = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
};

export default function BulkCareLogForm({ action }: Props) {
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState(action, null);

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
        className="create-button"
        onClick={() => setOpen(true)}
      >
        Bulk Log
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            style={{ backgroundColor: "#ffffff88" }}
          >
            <h2 className="modal-title text-2xl">Add Log To All Plants</h2>

            <p className="modal-description mt-2">
              Apply one care log entry to every avocado in the nursery.
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <label className="bulk-log-label">Log Type</label>

                <select
                  name="action_type"
                  required
                  defaultValue="water_change"
                  className="bulk-log-input"
                >
                  <option value="water_change">Water Change</option>
                  <option value="root_growth">Root Growth</option>
                  <option value="leaf_growth">Leaf Growth</option>
                  <option value="seed_crack">Seed Crack</option>
                  <option value="general_update">General Update</option>
                  <option value="repotted">Repotted</option>
                </select>
              </div>

              <div>
                <label className="bulk-log-label">Date</label>

                <input
                  type="date"
                  name="action_date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="bulk-log-input"
                />
              </div>

              <div>
                <label className="bulk-log-label">Notes</label>

                <textarea
                  name="notes"
                  rows={4}
                  className="bulk-log-input"
                  placeholder="Changed water for everyone, cleaned jars, checked roots..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
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
                  {pending ? "Saving..." : "Save Bulk Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
