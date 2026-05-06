"use client";

import { useState } from "react";
import CompressedImageInput from "./CompressedImageInput";
import { createCareLog } from "../app/actions/plant-actions";
import ContainerTypeahead from "./ContainerTypeahead";
import ActionTypeahead from "./ActionTypeahead";

type CareLogFormProps = {
  plantId: number;
  plantStage: string | null;
};

export default function CareLogForm({ plantId, plantStage }: CareLogFormProps) {
  const [selectedActionType, setSelectedActionType] = useState("");

  return (
    <form action={createCareLog} className="mt-4 space-y-4">
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
          className="w-full rounded border px-4 py-3 outline-none"
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
        <label className="mb-2 block font-medium">Photo</label>
        <CompressedImageInput id="photos" name="photos" multiple />{" "}
      </div>

      <button type="submit" className="submit-button">
        Save Care Log
      </button>
    </form>
  );
}
