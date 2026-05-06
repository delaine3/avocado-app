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
  plant_name?: string;
  action_type: CareActionType | string;
  action_date: string;
  notes: string | null;
  created_at: string;
  photo_url: string | null;
  container_type?: string | null;
  is_private: boolean;
  care_log_photos?: {
    id: number;
    photo_url: string;
    storage_path: string | null;
    created_at: string;
  }[];
}
