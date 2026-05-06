export function getLogTypeMeta(actionType: string) {
  switch (actionType) {
    case "water_change":
      return {
        label: "Water Change",
        className: "bg-[#d9ecff] text-[#1f5f99]",
        icon: "💧",
      };

    case "watered":
      return {
        label: "Watered",
        className: "bg-[#d9ecff] text-[#1f5f99]",
        icon: "🚿",
      };

    case "root_growth":
      return {
        label: "Root Growth",
        className: "bg-[#e7d4bf] text-[#6b4226]",
        icon: "🤎",
      };

    case "leaf_growth":
      return {
        label: "Leaf Growth",
        className: "bg-[#dff2c2] text-[#3d6b1f]",
        icon: "🍃",
      };

    case "seed_crack":
      return {
        label: "Seed Crack",
        className: "bg-[#f3e2b8] text-[#8a5a13]",
        icon: "🥑",
      };

    case "stem_growth":
      return {
        label: "Stem Growth",
        className: "bg-[#dff2c2] text-[#3d6b1f]",
        icon: "🌱",
      };

    case "repotted":
      return {
        label: "Repotted",
        className: "bg-[#e8dcc6] text-[#5c3d1e]",
        icon: "🪴",
      };

    case "fertilized":
      return {
        label: "Fertilized",
        className: "bg-[#efe4c8] text-[#6f4e1f]",
        icon: "🌾",
      };

    case "pruned":
      return {
        label: "Pruned",
        className: "bg-[#e6f0d2] text-[#4d6621]",
        icon: "✂️",
      };

    case "pest_check":
      return {
        label: "Pest Check",
        className: "bg-[#f8d7c8] text-[#8a3d24]",
        icon: "🐛",
      };

    case "sunlight_adjusted":
      return {
        label: "Sunlight Adjusted",
        className: "bg-[#fff3bf] text-[#7a5a00]",
        icon: "☀️",
      };

    case "moved_location":
      return {
        label: "Moved Location",
        className: "bg-[#e5e7eb] text-[#374151]",
        icon: "📍",
      };

    case "outdoor_transplant":
      return {
        label: "Outdoor Transplant",
        className: "bg-[#d7f0c2] text-[#3f6212]",
        icon: "🌳",
      };

    case "weather_note":
      return {
        label: "Weather Note",
        className: "bg-[#dbeafe] text-[#1e40af]",
        icon: "🌦️",
      };

    case "mulched":
      return {
        label: "Mulched",
        className: "bg-[#e6d3b3] text-[#6b4226]",
        icon: "🍂",
      };

    case "flowering":
      return {
        label: "Flowering",
        className: "bg-[#fde2f3] text-[#9d174d]",
        icon: "🌼",
      };

    case "fruiting":
      return {
        label: "Fruiting",
        className: "bg-[#dff2c2] text-[#3d6b1f]",
        icon: "🥑",
      };

    case "harvest":
      return {
        label: "Harvest",
        className: "bg-[#f3e2b8] text-[#8a5a13]",
        icon: "🧺",
      };

    case "general_update":
      return {
        label: "General Update",
        className: "bg-[#ece7dc] text-[#5c4a34]",
        icon: "📝",
      };

    default:
      return {
        label: actionType.replaceAll("_", " "),
        className: "bg-[#f3efe6] text-[#5f5648]",
        icon: "📘",
      };
  }
}
export function getLogTypeOptionsForStage(stage: string | null | undefined) {
  switch (stage) {
    case "dormant":
    case "cracked":
    case "rooting":
    case "stem_emerging":
      return [
        { value: "water_change", label: "Water Change" },
        { value: "seed_crack", label: "Seed Crack" },
        { value: "root_growth", label: "Root Growth" },
        { value: "stem_growth", label: "Stem Growth" },
        { value: "leaf_growth", label: "Leaf Growth" },
        { value: "sunlight_adjusted", label: "Sunlight Adjusted" },
        { value: "moved_location", label: "Moved Location" },
        { value: "repotted", label: "Repotted" },
        { value: "general_update", label: "General Update" },
      ];

    case "leafing":
    case "potted":
      return [
        { value: "watered", label: "Watered" },
        { value: "leaf_growth", label: "Leaf Growth" },
        { value: "stem_growth", label: "Stem Growth" },
        { value: "repotted", label: "Repotted" },
        { value: "fertilized", label: "Fertilized" },
        { value: "pruned", label: "Pruned" },
        { value: "pest_check", label: "Pest Check" },
        { value: "sunlight_adjusted", label: "Sunlight Adjusted" },
        { value: "moved_location", label: "Moved Location" },
        { value: "outdoor_transplant", label: "Outdoor Transplant" },
        { value: "general_update", label: "General Update" },
      ];

    case "outdoor":
    case "established":
      return [
        { value: "watered", label: "Watered" },
        { value: "leaf_growth", label: "Leaf Growth" },
        { value: "fertilized", label: "Fertilized" },
        { value: "pruned", label: "Pruned" },
        { value: "pest_check", label: "Pest Check" },
        { value: "weather_note", label: "Weather Note" },
        { value: "mulched", label: "Mulched" },
        { value: "flowering", label: "Flowering" },
        { value: "fruiting", label: "Fruiting" },
        { value: "harvest", label: "Harvest" },
        { value: "general_update", label: "General Update" },
      ];

    default:
      return [
        { value: "watered", label: "Watered" },
        { value: "leaf_growth", label: "Leaf Growth" },
        { value: "repotted", label: "Repotted" },
        { value: "pest_check", label: "Pest Check" },
        { value: "general_update", label: "General Update" },
      ];
  }
}
