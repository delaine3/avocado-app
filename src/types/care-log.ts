export type CareActionType =
  | "water_change"
  | "water_top_up"
  | "root_rinse"
  | "rotate"
  | "transplant"
  | "fertilize"
  | "soil_watering"
  | "moved_location";

export interface CareLog {
  id: number;
  plant_id: number;
  action_type: CareActionType | string;
  action_date: string;
  notes: string | null;
  created_at: string;
}
