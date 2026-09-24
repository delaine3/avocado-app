"use client";

import TypeaheadSelect from "./TypeaheadSelect";

const containerTypeOptions = [
  { value: "water_glass", label: "Water Glass" },
  { value: "small_pot", label: "Small Pot" },
  { value: "medium_pot", label: "Medium Pot" },
  { value: "large_pot", label: "Large Pot" },
  { value: "planter_box", label: "Planter Box" },
  { value: "grow_bag", label: "Grow Bag" },
  { value: "outdoor_ground", label: "Outdoor Ground" },
];

type Props = {
  name?: string;
  label?: string;
  defaultValue?: string | null;
  required?: boolean;
};

export default function ContainerTypeahead({
  name = "container_type",
  label = "Container Type",
  defaultValue,
  required = false,
}: Props) {
  return (
    <TypeaheadSelect
      name={name}
      label={label}
      options={containerTypeOptions}
      defaultValue={defaultValue}
      placeholder="Search container type..."
      required={required}
    />
  );
}
