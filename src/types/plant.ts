export type PlantStage =
  | "dormant"
  | "cracked"
  | "rooting"
  | "stem_emerging"
  | "leafing"
  | "potted";

export interface Plant {
  id: number;
  name: string;
  started_at: string | null;
  stage: PlantStage | string;
  location: string | null;
  container_type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  label?: string;
  is_private: boolean;
}
