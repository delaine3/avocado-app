"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PlantOption = {
  id: number;
  name: string;
};

type Props = {
  plants: PlantOption[];
  currentPlantId: number;
};

export default function PlantTypeaheadSelect({
  plants,
  currentPlantId,
}: Props) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPlants = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;

    return plants.filter((p) => p.name.toLowerCase().includes(q));
  }, [plants, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label className="mb-2 block font-medium">Jump to Plant</label>

      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search avocado..."
        className="w-full rounded border px-4 py-3 outline-none"
      />

      {open && (
        <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded border bg-white shadow-md">
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
                className="block w-full px-4 py-3 text-left text-sm hover:bg-stone-100 disabled:opacity-50"
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
