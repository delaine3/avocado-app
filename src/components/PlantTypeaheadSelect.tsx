"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

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
  const [loadingPlantId, setLoadingPlantId] = useState<number | null>(null);
  const [loadingPlantName, setLoadingPlantName] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPlants = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return plants;

    return plants.filter((plant) => plant.name.toLowerCase().includes(q));
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

  function handlePlantSelect(plant: PlantOption) {
    if (plant.id === currentPlantId) return;

    setLoadingPlantId(plant.id);
    setLoadingPlantName(plant.name);
    setOpen(false);
    router.push(`/plants/${plant.id}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label className="mb-2 block font-medium">Jump to Plant</label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          placeholder="Search plant..."
          className="w-full rounded border px-4 py-3 outline-none"
        />
      </div>
      {loadingPlantId && (
        <div className="p-2">
          <Spinner />
          <span className="mx-2 hidden xl:inline">
            Opening {loadingPlantName}...
          </span>
        </div>
      )}
      {open && (
        <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded border bg-white shadow-md">
          {filteredPlants.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">No plants found.</p>
          ) : (
            filteredPlants.map((plant) => {
              const isCurrentPlant = plant.id === currentPlantId;
              const isLoading = loadingPlantId === plant.id;

              return (
                <button
                  key={plant.id}
                  type="button"
                  disabled={isCurrentPlant || isLoading}
                  onClick={() => handlePlantSelect(plant)}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-stone-100 disabled:opacity-50"
                >
                  {plant.name}
                  {isCurrentPlant ? " · Current" : ""}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
