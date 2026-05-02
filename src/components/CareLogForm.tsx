"use client";

import { useState } from "react";
import CompressedImageInput from "./CompressedImageInput";
import { createCareLog } from "../app/actions/plant-actions";

export default function CareLogForm({ plantId }: { plantId: number }) {
  const [selectedActionType, setSelectedActionType] = useState("");

  return (
    <form action={createCareLog} className="mt-4 space-y-4">
      <input type="hidden" name="plant_id" value={plantId} />

      <div>
        <label className="mb-2 block font-medium">Log Type</label>

        <select
          name="action_type"
          value={selectedActionType}
          onChange={(e) => setSelectedActionType(e.target.value)}
          required
          className="w-full rounded border px-4 py-3 outline-none"
        >
          <option value="">Select log type</option>
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
          <label className="mb-2 block font-medium">New Container Type</label>

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
        <span>Keep this plant private?</span>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_private" className="h-8 w-8" />
        </label>
        <div className="text-stone-500 ">
          If this box is checked, the care log will not appear in the feed and
          nobody will be able to view it but you.
        </div>
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
        <CompressedImageInput id="photo" name="photo" />
      </div>

      <button type="submit" className="submit-button">
        Save Care Log
      </button>
    </form>
  );
}
