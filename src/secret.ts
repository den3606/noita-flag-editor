import type { CardUnlockedFlags, OrbCardUnlockedFlags, OrbSecretMap, SecretMap } from "./interfaces/noita";
import { exists, writeTextFile } from "@tauri-apps/api/fs";
import { path } from "@tauri-apps/api";
import {
  cardUnlockedFlagList,
  cardUnlockedFlagsRelatedOrbsNewList,
  NOITA_FLAG_EDITOR,
  orbsCardMappingList,
  orbsNewFileNameList,
} from "./const";
import type { Settings } from "./interfaces/setting";
import { getOrbSecretElements, getSecretElements } from "./get-html-element";

export const validateAndFixOrbSecrets = async (noitaFolderPath: string): Promise<void> => {
  try {
    const orbsNewExistsList = await Promise.all(
      orbsNewFileNameList.map(async (orbFileName) => {
        const filePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.ORBS_NEW_PATH, orbFileName);
        return exists(filePath);
      }),
    );
    const flagsExistsList = await Promise.all(
      cardUnlockedFlagsRelatedOrbsNewList.map(async (orbFileName) => {
        const filePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, orbFileName);
        return exists(filePath);
      }),
    );

    // NOTE:一部欠損しているファイルがある場合、生成(unlock)を優先する
    orbsCardMappingList.forEach(async (orbsCardMapping, i) => {
      if (orbsNewExistsList[i] && flagsExistsList[i]) {
        return;
      }

      if (!orbsNewExistsList[i] && !flagsExistsList[i]) {
        return;
      }

      if (orbsNewExistsList[i]) {
        const flagFileName = orbsCardMapping.flag;
        const filePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, flagFileName);
        alert(`${filePath} が欠損しています。ファイルを生成して修復します。`);
        console.warn(`${filePath} が欠損しています。ファイルを生成して修復します。`);
        await writeTextFile(filePath, "why are you looking here");
        return;
      }

      if (flagsExistsList[i]) {
        const orbsNewFileName = orbsCardMapping.orbsNew;
        const filePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.ORBS_NEW_PATH, orbsNewFileName);
        alert(`${filePath} が欠損しています。ファイルを生成して修復します。`);
        console.warn(`${filePath} が欠損しています。ファイルを生成して修復します。`);
        await writeTextFile(filePath, "why are you looking here");
        return;
      }
    });
  } catch (error) {
    alert("フラグファイル関連の参照に失敗しました。意図しないエラーであるため開発者へ連絡してください。");
    console.error("ファイルの存在チェック中にエラーが発生しました", error);
    throw error;
  }
};

export const loadOrbSecretsFromOriginal = async (noitaFolderPath: string): Promise<OrbSecretMap> => {
  const orbsNewExistsList = await Promise.all(
    orbsCardMappingList.map(async (orbsCardMapping) => {
      const orbFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.ORBS_NEW_PATH, orbsCardMapping.orbsNew);
      const flagFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, orbsCardMapping.flag);
      const [orbExists, flagExists] = await Promise.all([exists(orbFilePath), exists(flagFilePath)]);

      return [orbsCardMapping.flag, orbExists && flagExists] as [OrbCardUnlockedFlags, boolean];
    }),
  );

  return new Map(orbsNewExistsList);
};

export const loadSecretsFromOriginal = async (noitaFolderPath: string): Promise<SecretMap> => {
  const flagExistsList = await Promise.all(
    cardUnlockedFlagList.map(async (flag) => {
      const flagFilePath = await path.join(noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, flag);
      const flagExists = await exists(flagFilePath);

      return [flag, flagExists] as [CardUnlockedFlags, boolean];
    }),
  );

  return new Map(flagExistsList);
};

export const loadAndSetFlags = async (settings: Settings) => {
  await validateAndFixOrbSecrets(settings.noitaFolderPath);

  try {
    const [orbSecretMap, secretMap] = await Promise.all([
      loadOrbSecretsFromOriginal(settings.noitaFolderPath),
      loadSecretsFromOriginal(settings.noitaFolderPath),
    ]);

    const orbSecretElements = getOrbSecretElements();
    orbSecretMap.forEach((value, key) => {
      const element = orbSecretElements.get(key);
      if (element) {
        element.checked = value;
      }
    });

    const secretElements = getSecretElements();
    secretMap.forEach((value, key) => {
      const element = secretElements.get(key);
      if (element) {
        element.checked = value;
      }
    });
  } catch (e) {
    alert("フラグファイルの取得に失敗しています。想定されていないエラーなので、管理者へ連絡してください");
    throw new Error("Flagファイルの取得に失敗しました");
  }
};