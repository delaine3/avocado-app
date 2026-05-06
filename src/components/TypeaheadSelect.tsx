"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TypeaheadOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: TypeaheadOption[];
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
};

export default function TypeaheadSelect({
  name,
  label,
  options,
  defaultValue,
  placeholder = "Search...",
  required = false,
  onChange,
}: Props) {
  const defaultOption = options.find((option) => option.value === defaultValue);

  const [query, setQuery] = useState(defaultOption?.label ?? "");
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!hasTyped) return options;

    const q = query.trim().toLowerCase();

    if (!q) return options;

    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query, hasTyped]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setHasTyped(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="mb-2 block font-medium">{label}</label>

      <input
        type="text"
        value={query}
        onFocus={() => {
          setOpen(true);
          setHasTyped(false);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedValue("");
          setOpen(true);
          setHasTyped(true);
          onChange?.("");
        }}
        placeholder={placeholder}
        className="w-full rounded border px-4 py-3 outline-none"
      />

      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />

      {open && (
        <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded border bg-white shadow-md">
          {filteredOptions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">
              No options found.
            </p>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedValue(option.value);
                  setQuery(option.label);
                  setOpen(false);
                  setHasTyped(false);
                  onChange?.(option.value);
                }}
                className="block w-full px-4 py-3 text-left text-sm hover:bg-stone-100"
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
