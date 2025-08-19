import path from "path-browserify";
import z, { ZodError, ZodIssue } from "zod";

// JSONファイルから読み込む生の設定データの型
export const rawSettingsZ = z.object({
  noitaFolderPath: z.string().nullable().optional(),
  deleteBonesNew: z.boolean().optional(),
});

export type RawSettings = z.infer<typeof rawSettingsZ>;

// デフォルト値を適用した設定データの型
export const defaultSettingsZ = z.object({
  noitaFolderPath: z.string().nullable().default(null),
  deleteBonesNew: z.boolean().default(false),
});

export type DefaultSettings = z.infer<typeof defaultSettingsZ>;

const validatedSettingsZ = z.object({
  noitaFolderPath: z
    .string()
    .nonempty({ message: "フォルダが設定されていません。先にフォルダを指定してください。" })
    .refine((folderPath) => path.basename(folderPath) !== "Nolla_Games_Noita", {
      message: "Noitaのフォルダが指定されていません。Nolla_Games_Noitaフォルダを指定してください。",
    }),
  deleteBonesNew: z.boolean(),
});

export type ValidatedSettingsType = z.infer<typeof validatedSettingsZ>;

export class Settings {
  public noitaFolderPath: string | null;
  public deleteBonesNew: boolean;

  constructor(rawSettings: RawSettings = {}) {
    const withDefaults = defaultSettingsZ.parse(rawSettings);

    this.noitaFolderPath = withDefaults.noitaFolderPath;
    this.deleteBonesNew = withDefaults.deleteBonesNew;
  }

  validate(): ValidatedSettingsType {
    return validatedSettingsZ.parse({
      noitaFolderPath: this.noitaFolderPath,
      deleteBonesNew: this.deleteBonesNew,
    });
  }

  isValid(): boolean {
    try {
      this.validate();
      return true;
    } catch {
      return false;
    }
  }

  static getTargetErrorMessage(error: unknown, keyName: keyof ValidatedSettingsType): string | null {
    if (!(error instanceof ZodError)) {
      return null;
    }

    const keyNameError = error.issues.find((issue) => issue.path.includes(keyName));
    return keyNameError ? keyNameError.message : null;
  }
}
