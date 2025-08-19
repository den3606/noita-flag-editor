import * as z from "zod";

export const SettingsZ = z.object({
  noitaFolderPath: z.string().default(""),
  deleteBonesNew: z.boolean().default(false),
});

export type Settings = z.infer<typeof SettingsZ>;
