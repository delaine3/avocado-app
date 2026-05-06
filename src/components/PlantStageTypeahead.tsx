"use client";

import TypeaheadSelect from "./TypeaheadSelect";

const plantStageOptions = [
  { value: "dormant", label: "Dormant" },
  { value: "cracked", label: "Cracked" },
  { value: "rooting", label: "Rooting" },
  { value: "stem_emerging", label: "Stem Emerging" },
  { value: "leafing", label: "Leafing" },
  { value: "potted", label: "Potted" },
  { value: "outdoor", label: "Outdoor" },
  { value: "established", label: "Established" },
];

type Props = {
  defaultValue?: string | null;
};

export default function PlantStageTypeahead({ defaultValue }: Props) {
  return (
    <TypeaheadSelect
      name="stage"
      label="Stage"
      options={plantStageOptions}
      defaultValue={defaultValue}
      placeholder="Search plant stage..."
      required
    />
  );
}
