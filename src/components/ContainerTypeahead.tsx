"use client";

import TypeaheadSelect from "./TypeaheadSelect";

const containerTypeOptions = [
  { value: "water_glass", label: "Water Glass" },
  { value: "water_jar", label: "Water Jar" },
  { value: "glass_vase", label: "Glass Vase" },
  { value: "small_pot", label: "Small Pot" },
  { value: "medium_pot", label: "Medium Pot" },
  { value: "large_pot", label: "Large Pot" },
  { value: "terracotta_pot", label: "Terracotta Pot" },
  { value: "ceramic_pot", label: "Ceramic Pot" },
  { value: "plastic_pot", label: "Plastic Pot" },
  { value: "planter_box", label: "Planter Box" },
  { value: "grow_bag", label: "Grow Bag" },
  { value: "outdoor_ground", label: "Outdoor Ground" },
  { value: "raised_bed", label: "Raised Bed" },
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
