"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PlantOption = {
  id: number;
  name: string;
};

type PlantTypeaheadSelectProps = {
  plants: PlantOption[];
  currentPlantId: number;
};

export default function PlantTypeaheadSelect({
  plants,
  currentPlantId,
}: PlantTypeaheadSelectProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return plants;
    }

    return plants.filter((plant) =>
      plant.name.toLowerCase().includes(normalizedQuery),
    );
  }, [plants, query]);

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="plant-search" className="mb-2 block font-medium">
        Jump to Plant
      </label>

      <input
        id="plant-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search avocado..."
        className="w-full rounded-xl border px-4 py-3 outline-none"
      />

      {open && (
        <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border bg-white shadow-md">
          {filteredPlants.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">No plants found.</p>
          ) : (
            filteredPlants.map((plant) => (
              <button
                key={plant.id}
                type="button"
                disabled={plant.id === currentPlantId}
                onClick={() => {
                  setOpen(false);
                  router.push(`/plants/${plant.id}`);
                }}
                className="block w-full px-4 py-3 text-left text-sm hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {plant.name}
                {plant.id === currentPlantId ? " · Current" : ""}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
