"use client";

import { getLogTypeOptionsForStage } from "../lib/getLogTypeMeta";
import TypeaheadSelect from "./TypeaheadSelect";

type Props = {
  plantStage?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
};

export default function ActionTypeahead({
  plantStage,
  defaultValue,
  onChange,
}: Props) {
  const options = getLogTypeOptionsForStage(plantStage);

  return (
    <TypeaheadSelect
      name="action_type"
      label="Log Type"
      options={options}
      defaultValue={defaultValue}
      placeholder="Search log type..."
      required
      onChange={onChange}
    />
  );
}
