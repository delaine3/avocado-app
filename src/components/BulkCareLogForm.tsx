"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message);
      setOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const modal = (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-4 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        style={{ backgroundColor: "#fffaf1", color: "#4d370f" }}
      >
        <h1 className="text-xl sm:text-2xl">Add Log To All Plants</h1>

        <p className="mt-2">
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

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
              {pending ? "Saving..." : "Save Bulk Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20"
        onClick={() => setOpen(true)}
      >
        Bulk Log
      </button>

      {mounted && open ? createPortal(modal, document.body) : null}
    </>
  );
}
