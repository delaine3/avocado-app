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
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultOption = useMemo(
    () => options.find((option) => option.value === defaultValue),
    [options, defaultValue],
  );

  const [query, setQuery] = useState(defaultOption?.label ?? "");
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );

  const filteredOptions = useMemo(() => {
    if (!hasTyped) return options;

    const q = query.trim().toLowerCase();

    if (!q) return options;

    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query, hasTyped]);

  useEffect(() => {
    setQuery(defaultOption?.label ?? "");
    setSelectedValue(defaultValue ?? "");
  }, [defaultOption, defaultValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setHasTyped(false);
        setQuery(selectedOption?.label ?? "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOption]);

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
        onClick={() => {
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
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full rounded border px-4 py-3 outline-none"
      />

      <input type="hidden" name={name} value={selectedValue} />

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded border bg-white shadow-md"
        >
          {filteredOptions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">
              No options found.
            </p>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === selectedValue}
                onClick={() => {
                  setSelectedValue(option.value);
                  setQuery(option.label);
                  setOpen(false);
                  setHasTyped(false);
                  onChange?.(option.value);
                }}
                className={`block w-full px-4 py-3 text-left text-sm hover:bg-stone-100 ${
                  option.value === selectedValue
                    ? "bg-stone-100 font-semibold"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}

      {required && !selectedValue && (
        <p className="mt-1 text-xs text-stone-500">
          Select an option from the list.
        </p>
      )}
    </div>
  );
}
