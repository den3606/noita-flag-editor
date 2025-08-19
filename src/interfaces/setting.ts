import * as z from "zod";

export const SettingsZ = z.object({
  noitaFolderPath: z.string().nullable().default(null),
  deleteBonesNew: z.boolean().default(false),
});

export type Settings = z.infer<typeof SettingsZ>;
