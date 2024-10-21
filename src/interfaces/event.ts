import type { OrbSecret, Secret } from "./noita";

export interface EditFlagsButtonParams {
  orbSecret: Map<OrbSecret, HTMLInputElement>;
  secret: Map<Secret, HTMLInputElement>;
  folderPath: string;
}

export interface StartButtonParams {
  monitorStatus: HTMLParagraphElement;
  filePath: string;
}
