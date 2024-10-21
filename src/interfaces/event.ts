import type { OrbSecretElementMap, SecretElementMap } from "./noita";

export interface SetCurrentFlagsButtonParams {
  orbSecret: OrbSecretElementMap;
  secret: SecretElementMap;
  folderPath: string;
}

export interface StartButtonParams {
  monitorStatus: HTMLSpanElement;
  folderPath: string;
}
