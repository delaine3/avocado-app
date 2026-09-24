"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import CompressedImageInput from "./CompressedImageInput";
import { createCareLog } from "../app/actions/plant-actions";
import ContainerTypeahead from "./ContainerTypeahead";
import ActionTypeahead from "./ActionTypeahead";
import Spinner from "./Spinner";
import SubmitButton from "./SubmitButton";

type CareLogFormProps = {
  plantId: number;
  plantStage: string | null;
};

export default function CareLogForm({ plantId, plantStage }: CareLogFormProps) {
  const [selectedActionType, setSelectedActionType] = useState("");

  const [state, formAction, pending] = useActionState(createCareLog, null);

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="plant_id" value={plantId} />

      <ActionTypeahead
        plantStage={plantStage}
        defaultValue={selectedActionType}
        onChange={setSelectedActionType}
      />

      {selectedActionType === "repotted" && (
        <ContainerTypeahead
          name="container_type"
          label="New Container Type"
          required
        />
      )}

      <div>
        <label className="mb-2 block font-medium">Care Date</label>
        <input
          name="action_date"
          type="date"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
          className="block w-full min-w-0 max-w-full rounded border px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="is_private" className="h-6 w-6" />
          <span className="font-medium">Keep this log private?</span>
        </label>

        <p className="mt-2 text-sm text-stone-500">
          If this box is checked, the care log will not appear in the feed and
          nobody will be able to view it but you.
        </p>
      </div>

      <div>
        <label className="mb-2 block font-medium">Notes</label>
        <textarea
          name="notes"
          rows={3}
          className="w-full rounded border px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Photos</label>
        <CompressedImageInput id="photos" name="photos" multiple />
      </div>
      <SubmitButton idleText="Save" pendingText="Saving..." />
    </form>
  );
}
