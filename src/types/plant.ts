export type PlantStage =
  | "dormant"
  | "cracked"
  | "rooting"
  | "stem_emerging"
  | "leafing"
  | "potted"
  | "outdoor"
  | "established";

export interface Plant {
  id: number;
  name: string;
  user_id: string;
  started_at: string | null;
  stage: PlantStage | string;
  location: string | null;
  container_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  label?: string;
  is_private: boolean;
}
