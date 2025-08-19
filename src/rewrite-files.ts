import { exists, readDir, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import path from "path-browserify";
import { NOITA_FLAG_EDITOR, orbsCardMappingList } from "./const";
import { getOrbSecretElements, getSecretElements } from "./get-html-element";
import { Settings, ValidatedSettingsType } from "./models/settings";
import { validateAndFixOrbSecrets } from "./secret";

const rewriteFlags = async (noitaFolderPath: string): Promise<void> => {
  await validateAndFixOrbSecrets(noitaFolderPath);
  try {
    // orb系
    const orbSecretElements = getOrbSecretElements();
    orbSecretElements.forEach(async (checkboxElement, key) => {
      const orbFileName = orbsCardMappingList.filter((m) => m.flag === key).map((m) => m.orbsNew)[0];

      const orbFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.ORBS_NEW_PATH, orbFileName);
      const flagFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, key);

      if (checkboxElement.checked) {
        await writeTextFile(orbFilePath, "why are you looking here");
        await writeTextFile(flagFilePath, "why are you looking here");
      } else {
        if (await exists(orbFilePath)) {
          await remove(orbFilePath);
        }

        if (await exists(flagFilePath)) {
          await remove(flagFilePath);
        }
      }
    });

    // orb外
    const secretElements = getSecretElements();
    secretElements.forEach(async (checkboxElement, key) => {
      const flagFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, key);

      if (checkboxElement.checked) {
        await writeTextFile(flagFilePath, "why are you looking here");
      } else {
        if (await exists(flagFilePath)) {
          await remove(flagFilePath);
        }
      }
    });
  } catch (error) {
    alert("フラグファイルの取得に失敗しています。想定されていないエラーなので、管理者へ連絡してください");
    console.error("Flagファイルの取得に失敗しました");
    throw error;
  }
};

const deleteBonesNew = async (noitaFolderPath: string, deleteBonesNew: boolean): Promise<void> => {
  if (!deleteBonesNew) {
    return;
  }
  try {
    const bonesNewFolderPath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.BONES_NEW_PATH);
    const entries = await readDir(bonesNewFolderPath);
    const fileNames = entries.map((entry) => entry.name).filter((name) => name !== undefined) as string[];

    fileNames.forEach(async (fileName) => {
      const isTargetFile = /item[0-9]+\.xml/.test(fileName);
      if (isTargetFile) {
        const targetFilePath = await path.join(bonesNewFolderPath, fileName);
        await remove(targetFilePath);
        console.info(`delete ${targetFilePath}`);
      }
    });
  } catch (error) {
    console.error("Error fetching filenames:", error);
  }
};

const execute = async (settings: ValidatedSettingsType): Promise<void> => {
  await rewriteFlags(settings.noitaFolderPath);
  await deleteBonesNew(settings.noitaFolderPath, settings.deleteBonesNew);
};

export const rewriteFiles = {
  execute,
};
