export const logTypes = [
  "Mood",
  "Energy",
  "Dessert eaten",
  "Dessert craving",
  "Shower",
  "Sunlight",
  "Exercise",
  "Treadmill walk",
  "Reading",
  "App work",
  "TikTok used",
  "TikTok avoided",
  "Plant care",
  "Recurring thought",
  "Social interaction",
] as const;

export type LogType = (typeof logTypes)[number];
