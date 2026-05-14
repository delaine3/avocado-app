"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import PlantStageTypeahead from "@/src/components/PlantStageTypeahead";
import ContainerTypeahead from "@/src/components/ContainerTypeahead";
import SubmitButton from "@/src/components/SubmitButton";
import { createPlant } from "@/src/app/plants/new/actions";
import LoadingLink from "./LoadingLink";

export default function NewPlantForm() {
  const [state, formAction] = useActionState(createPlant, null);

  useEffect(() => {
    if (!state) return;

    if (!state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="rounded field-form">
      <div>
        <label htmlFor="name" className="mb-2 block font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded border px-4 py-3 outline-none ring-0"
          placeholder="Earth"
        />
      </div>

      <div>
        <label htmlFor="started_at" className="mb-2 block font-medium">
          Start Date
        </label>
        <input
          id="started_at"
          name="started_at"
          type="date"
          className="w-full rounded border px-4 py-3 outline-none ring-0"
        />
      </div>

      <PlantStageTypeahead defaultValue="" />

      <div>
        <label htmlFor="location" className="mb-2 block font-medium">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className="w-full rounded border px-4 py-3 outline-none ring-0"
          placeholder="Sunroom"
        />
      </div>

      <ContainerTypeahead />

      <div>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="in_soil" className="h-6 w-6" />
          <span className="font-medium">This plant is in soil</span>
        </label>

        <p className="mt-2 text-sm text-stone-500">
          Soil plants get watered. Water-propagation plants get water changes.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="is_private" className="h-6 w-6" />
          <span className="font-medium">Keep this plant private?</span>
        </label>

        <p className="mt-2 text-sm text-stone-500">
          If this box is checked, the plant will not appear in the feed and
          nobody will be able to view it but you.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full rounded border px-4 py-3 outline-none ring-0"
          placeholder="Newest seed with intact coat and suspiciously calm energy."
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <SubmitButton idleText="Save Plant" pendingText="Saving Plant..." />

        <LoadingLink href="/" className="cancel-button text-center">
          Cancel
        </LoadingLink>
      </div>
    </form>
  );
}
