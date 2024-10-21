import type { OrbSecret, Secret } from "./interfaces/noita";

export const getOrbSecretElements = (): Map<OrbSecret, HTMLInputElement> => {
  // orb secret checkbox
  const orb00 = document.querySelector("#orb-00") as HTMLInputElement;
  const orb01 = document.querySelector("#orb-01") as HTMLInputElement;
  const orb02 = document.querySelector("#orb-02") as HTMLInputElement;
  const orb03 = document.querySelector("#orb-03") as HTMLInputElement;
  const orb04 = document.querySelector("#orb-04") as HTMLInputElement;
  const orb05 = document.querySelector("#orb-05") as HTMLInputElement;
  const orb06 = document.querySelector("#orb-06") as HTMLInputElement;
  const orb07 = document.querySelector("#orb-07") as HTMLInputElement;
  const orb08 = document.querySelector("#orb-08") as HTMLInputElement;
  const orb09 = document.querySelector("#orb-09") as HTMLInputElement;
  const orb10 = document.querySelector("#orb-10") as HTMLInputElement;

  return new Map<OrbSecret, HTMLInputElement>([
    ["orb00", orb00],
    ["orb01", orb01],
    ["orb02", orb02],
    ["orb03", orb03],
    ["orb04", orb04],
    ["orb05", orb05],
    ["orb06", orb06],
    ["orb07", orb07],
    ["orb08", orb08],
    ["orb09", orb09],
    ["orb10", orb10],
  ]);
};

export const getSecretElements = (): Map<Secret, HTMLInputElement> => {
  // secret checkbox
  const touchGrass = document.querySelector("#secret-touch-grass") as HTMLInputElement;
  const blackHole = document.querySelector("#secret-black-hole") as HTMLInputElement;
  const bombHolyGiga = document.querySelector("#secret-bomb-holy-giga") as HTMLInputElement;
  const cessation = document.querySelector("#secret-cessation") as HTMLInputElement;
  const destruction = document.querySelector("#secret-destruction") as HTMLInputElement;
  const divide = document.querySelector("#secret-divide") as HTMLInputElement;
  const dragon = document.querySelector("#secret-dragon") as HTMLInputElement;
  const duplicate = document.querySelector("#secret-duplicate") as HTMLInputElement;
  const everything = document.querySelector("#secret-everything") as HTMLInputElement;
  const fish = document.querySelector("#secret-fish") as HTMLInputElement;
  const funky = document.querySelector("#secret-funky") as HTMLInputElement;
  const homingWand = document.querySelector("#secret-homing-wand") as HTMLInputElement;
  const kantele = document.querySelector("#secret-kantele") as HTMLInputElement;
  const maggot = document.querySelector("#secret-maggot") as HTMLInputElement;
  const maths = document.querySelector("#secret-maths") as HTMLInputElement;
  const mestari = document.querySelector("#secret-mestari") as HTMLInputElement;
  const musicbox = document.querySelector("#secret-musicbox") as HTMLInputElement;
  const nukegiga = document.querySelector("#secret-nukegiga") as HTMLInputElement;
  const ocarina = document.querySelector("#secret-ocarina") as HTMLInputElement;
  const paint = document.querySelector("#secret-paint") as HTMLInputElement;
  const piss = document.querySelector("#secret-piss") as HTMLInputElement;
  const polymorph = document.querySelector("#secret-polymorph") as HTMLInputElement;
  const pyramid = document.querySelector("#secret-pyramid") as HTMLInputElement;
  const rain = document.querySelector("#secret-rain") as HTMLInputElement;
  const rainbowTrail = document.querySelector("#secret-rainbow-trail") as HTMLInputElement;
  const seaMimic = document.querySelector("#secret-sea-mimic") as HTMLInputElement;

  return new Map<Secret, HTMLInputElement>([
    ["touchGrass", touchGrass],
    ["blackHole", blackHole],
    ["bombHolyGiga", bombHolyGiga],
    ["cessation", cessation],
    ["destruction", destruction],
    ["divide", divide],
    ["dragon", dragon],
    ["duplicate", duplicate],
    ["everything", everything],
    ["fish", fish],
    ["funky", funky],
    ["homingWand", homingWand],
    ["kantele", kantele],
    ["maggot", maggot],
    ["maths", maths],
    ["mestari", mestari],
    ["musicbox", musicbox],
    ["nukegiga", nukegiga],
    ["ocarina", ocarina],
    ["paint", paint],
    ["piss", piss],
    ["polymorph", polymorph],
    ["pyramid", pyramid],
    ["rain", rain],
    ["rainbowTrail", rainbowTrail],
    ["seaMimic", seaMimic],
  ]);
};
