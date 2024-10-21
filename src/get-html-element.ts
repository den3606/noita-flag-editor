import type {
  OrbCardUnlockedFlags,
  OrbSecretElementMap,
  CardUnlockedFlags,
  SecretElementMap,
} from "./interfaces/noita";

export const getOrbSecretElements = (): OrbSecretElementMap => {
  // orb secret checkbox
  const orb00 = document.querySelector("#card_unlocked_sea_lava") as HTMLInputElement;
  const orb01 = document.querySelector("#card_unlocked_crumbling_earth") as HTMLInputElement;
  const orb02 = document.querySelector("#card_unlocked_tentacle") as HTMLInputElement;
  const orb03 = document.querySelector("#card_unlocked_nuke") as HTMLInputElement;
  const orb04 = document.querySelector("#card_unlocked_necromancy") as HTMLInputElement;
  const orb05 = document.querySelector("#card_unlocked_bomb_holy") as HTMLInputElement;
  const orb06 = document.querySelector("#card_unlocked_spiral_shot") as HTMLInputElement;
  const orb07 = document.querySelector("#card_unlocked_cloud_thunder") as HTMLInputElement;
  const orb08 = document.querySelector("#card_unlocked_firework") as HTMLInputElement;
  const orb09 = document.querySelector("#card_unlocked_exploding_deer") as HTMLInputElement;
  const orb10 = document.querySelector("#card_unlocked_material_cement") as HTMLInputElement;

  return new Map<OrbCardUnlockedFlags, HTMLInputElement>([
    ["card_unlocked_sea_lava", orb00],
    ["card_unlocked_crumbling_earth", orb01],
    ["card_unlocked_tentacle", orb02],
    ["card_unlocked_nuke", orb03],
    ["card_unlocked_necromancy", orb04],
    ["card_unlocked_bomb_holy", orb05],
    ["card_unlocked_spiral_shot", orb06],
    ["card_unlocked_cloud_thunder", orb07],
    ["card_unlocked_firework", orb08],
    ["card_unlocked_exploding_deer", orb09],
    ["card_unlocked_material_cement", orb10],
  ]);
};

export const getSecretElements = (): SecretElementMap => {
  // secret checkbox

  const touchGrass = document.querySelector("#card_unlocked_touch_grass") as HTMLInputElement;
  const alchemy = document.querySelector("#card_unlocked_alchemy") as HTMLInputElement;
  const blackHole = document.querySelector("#card_unlocked_black_hole") as HTMLInputElement;
  const bombHolyGiga = document.querySelector("#card_unlocked_bomb_holy_giga") as HTMLInputElement;
  const cessation = document.querySelector("#card_unlocked_cessation") as HTMLInputElement;
  const destruction = document.querySelector("#card_unlocked_destruction") as HTMLInputElement;
  const divide = document.querySelector("#card_unlocked_divide") as HTMLInputElement;
  const dragon = document.querySelector("#card_unlocked_dragon") as HTMLInputElement;
  const duplicate = document.querySelector("#card_unlocked_duplicate") as HTMLInputElement;
  const everything = document.querySelector("#card_unlocked_everything") as HTMLInputElement;
  const fish = document.querySelector("#card_unlocked_fish") as HTMLInputElement;
  const funky = document.querySelector("#card_unlocked_funky") as HTMLInputElement;
  const homingWand = document.querySelector("#card_unlocked_homing_wand") as HTMLInputElement;
  const kantele = document.querySelector("#card_unlocked_kantele") as HTMLInputElement;
  const maggot = document.querySelector("#card_unlocked_maggot") as HTMLInputElement;
  const maths = document.querySelector("#card_unlocked_maths") as HTMLInputElement;
  const mestari = document.querySelector("#card_unlocked_mestari") as HTMLInputElement;
  const musicbox = document.querySelector("#card_unlocked_musicbox") as HTMLInputElement;
  const nukegiga = document.querySelector("#card_unlocked_nukegiga") as HTMLInputElement;
  const ocarina = document.querySelector("#card_unlocked_ocarina") as HTMLInputElement;
  const paint = document.querySelector("#card_unlocked_paint") as HTMLInputElement;
  const piss = document.querySelector("#card_unlocked_piss") as HTMLInputElement;
  const polymorph = document.querySelector("#card_unlocked_polymorph") as HTMLInputElement;
  const pyramid = document.querySelector("#card_unlocked_pyramid") as HTMLInputElement;
  const rain = document.querySelector("#card_unlocked_rain") as HTMLInputElement;
  const rainbowTrail = document.querySelector("#card_unlocked_rainbow_trail") as HTMLInputElement;
  const seaMimic = document.querySelector("#card_unlocked_sea_mimic") as HTMLInputElement;

  return new Map<CardUnlockedFlags, HTMLInputElement>([
    ["card_unlocked_touch_grass", touchGrass],
    ["card_unlocked_alchemy", alchemy],
    ["card_unlocked_black_hole", blackHole],
    ["card_unlocked_bomb_holy_giga", bombHolyGiga],
    ["card_unlocked_cessation", cessation],
    ["card_unlocked_destruction", destruction],
    ["card_unlocked_divide", divide],
    ["card_unlocked_dragon", dragon],
    ["card_unlocked_duplicate", duplicate],
    ["card_unlocked_everything", everything],
    ["card_unlocked_fish", fish],
    ["card_unlocked_funky", funky],
    ["card_unlocked_homing_wand", homingWand],
    ["card_unlocked_kantele", kantele],
    ["card_unlocked_maggot", maggot],
    ["card_unlocked_maths", maths],
    ["card_unlocked_mestari", mestari],
    ["card_unlocked_musicbox", musicbox],
    ["card_unlocked_nukegiga", nukegiga],
    ["card_unlocked_ocarina", ocarina],
    ["card_unlocked_paint", paint],
    ["card_unlocked_piss", piss],
    ["card_unlocked_polymorph", polymorph],
    ["card_unlocked_pyramid", pyramid],
    ["card_unlocked_rain", rain],
    ["card_unlocked_rainbow_trail", rainbowTrail],
    ["card_unlocked_sea_mimic", seaMimic],
  ]);
};
