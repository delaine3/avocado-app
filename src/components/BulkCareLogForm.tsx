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

type CareGroup = "all" | "soil" | "water";

const actionOptionsByCareGroup: Record<
  CareGroup,
  { value: string; label: string }[]
> = {
  all: [
    { value: "general_update", label: "General Update" },
    { value: "leaf_growth", label: "Leaf Growth" },
    { value: "moved_location", label: "Moved Location" },
    { value: "sunlight_adjusted", label: "Sunlight Adjusted" },
  ],
  soil: [
    { value: "watered", label: "Watered" },
    { value: "leaf_growth", label: "Leaf Growth" },
    { value: "stem_growth", label: "Stem Growth" },
    { value: "fertilized", label: "Fertilized" },
    { value: "pruned", label: "Pruned" },
    { value: "pest_check", label: "Pest Check" },
    { value: "mulched", label: "Mulched" },
    { value: "weather_note", label: "Weather Note" },
    { value: "general_update", label: "General Update" },
  ],
  water: [
    { value: "water_change", label: "Water Change" },
    { value: "root_growth", label: "Root Growth" },
    { value: "seed_crack", label: "Seed Crack" },
    { value: "stem_growth", label: "Stem Growth" },
    { value: "leaf_growth", label: "Leaf Growth" },
    { value: "general_update", label: "General Update" },
  ],
};

export default function BulkCareLogForm({ action }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [careGroup, setCareGroup] = useState<CareGroup>("all");
  const [actionType, setActionType] = useState(
    actionOptionsByCareGroup.all[0].value,
  );

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

  const actionOptions = actionOptionsByCareGroup[careGroup];

  function handleCareGroupChange(value: CareGroup) {
    setCareGroup(value);
    setActionType(actionOptionsByCareGroup[value][0].value);
  }

  const modal = (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded p-4 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        style={{ backgroundColor: "#fffaf1", color: "#4d370f" }}
      >
        <h1 className="text-xl sm:text-2xl">Add Log To Multiple Plants</h1>

        <p className="mt-2">Apply one care log entry to a care group.</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="bulk-log-label">Plant Group</label>
            <select
              name="care_group"
              className="bulk-log-input"
              value={careGroup}
              onChange={(event) =>
                handleCareGroupChange(event.target.value as CareGroup)
              }
            >
              <option value="all">All plants</option>
              <option value="soil">Soil plants only</option>
              <option value="water">Water plants only</option>
            </select>
          </div>

          <div>
            <label className="bulk-log-label">Log Type</label>
            <select
              name="action_type"
              required
              value={actionType}
              onChange={(event) => setActionType(event.target.value)}
              className="bulk-log-input"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-stone-600">
              {careGroup === "soil"
                ? "Soil plants can be watered, fertilized, pruned, checked, or updated."
                : careGroup === "water"
                  ? "Water plants can get water changes and early growth updates."
                  : "All plants only shows actions that make sense for every plant."}
            </p>
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
              placeholder={
                careGroup === "soil"
                  ? "Watered soil plants, checked leaves, rotated pots..."
                  : careGroup === "water"
                    ? "Changed water, cleaned jars, checked roots..."
                    : "General update for the plant squad..."
              }
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
