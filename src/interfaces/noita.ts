import type { cardUnlockedFlagList, cardUnlockedFlagsRelatedOrbsNewList } from "../const";

export type OrbCardUnlockedFlags = (typeof cardUnlockedFlagsRelatedOrbsNewList)[number];
export type CardUnlockedFlags = (typeof cardUnlockedFlagList)[number];

export type OrbSecretMap = Map<OrbCardUnlockedFlags, boolean>;
export type SecretMap = Map<CardUnlockedFlags, boolean>;
export type OrbSecretElementMap = Map<OrbCardUnlockedFlags, HTMLInputElement>;
export type SecretElementMap = Map<CardUnlockedFlags, HTMLInputElement>;
