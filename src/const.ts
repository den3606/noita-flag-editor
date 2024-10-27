export const NOITA_FLAG_EDITOR = {
  SETTINGS_FILE: "settings.json",
  ORBS_NEW_PATH: "save00/persistent/orbs_new",
  FLAGS_PATH: "save00/persistent/flags",
  BONES_NEW_PATH: "save00/persistent/bones_new"
} as const;

export const MONITOR_STATUS = {
  CONNECTING: "接続待機中",
  CONNECTED: "接続中",
  COMPLETED: "接続終了",
  TIMEOUT: "接続切れ",
  UNDEFINED: "未定義レスポンス",
} as const;

export const orbsNewFileNameList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;
export const cardUnlockedFlagsRelatedOrbsNewList = [
  "card_unlocked_sea_lava",
  "card_unlocked_crumbling_earth",
  "card_unlocked_tentacle",
  "card_unlocked_nuke",
  "card_unlocked_necromancy",
  "card_unlocked_bomb_holy",
  "card_unlocked_spiral_shot",
  "card_unlocked_cloud_thunder",
  "card_unlocked_firework",
  "card_unlocked_exploding_deer",
  "card_unlocked_material_cement",
] as const;

const mapping = Array.from({ length: 11 }, (_, i) => i);
export const orbsCardMappingList = mapping.map((i) => {
  return { orbsNew: orbsNewFileNameList[i], flag: cardUnlockedFlagsRelatedOrbsNewList[i] };
});

export const cardUnlockedFlagList = [
  "card_unlocked_touch_grass",
  "card_unlocked_alchemy",
  "card_unlocked_black_hole",
  // "card_unlocked_bomb_holy",
  "card_unlocked_bomb_holy_giga",
  "card_unlocked_cessation",
  // "card_unlocked_cloud_thunder",
  // "card_unlocked_crumbling_earth",
  "card_unlocked_destruction",
  "card_unlocked_divide",
  "card_unlocked_dragon",
  "card_unlocked_duplicate",
  "card_unlocked_everything",
  // "card_unlocked_exploding_deer",
  // "card_unlocked_firework",
  "card_unlocked_fish",
  "card_unlocked_funky",
  "card_unlocked_homing_wand",
  "card_unlocked_kantele",
  "card_unlocked_maggot",
  // "card_unlocked_material_cement",
  "card_unlocked_maths",
  "card_unlocked_mestari",
  "card_unlocked_musicbox",
  // "card_unlocked_necromancy",
  // "card_unlocked_nuke",
  "card_unlocked_nukegiga",
  "card_unlocked_ocarina",
  "card_unlocked_paint",
  "card_unlocked_piss",
  "card_unlocked_polymorph",
  "card_unlocked_pyramid",
  "card_unlocked_rain",
  "card_unlocked_rainbow_trail",
  // "card_unlocked_sea_lava",
  "card_unlocked_sea_mimic",
  // "card_unlocked_spiral_shot",
  // "card_unlocked_tentacle",
] as const;
