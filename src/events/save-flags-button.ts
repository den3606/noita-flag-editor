import { path } from "@tauri-apps/api";
import { NOITA_FLAG_EDITOR, orbsCardMappingList } from "../const";
import { getOrbSecretElements, getSecretElements } from "../get-html-element";
import type { Settings } from "../interfaces/setting";
import { validateAndFixOrbSecrets } from "../secret";
import { exists, removeFile, writeTextFile } from "@tauri-apps/api/fs";

const click = async (event: Event, settings: Settings): Promise<void> => {
  event.preventDefault();

  await validateAndFixOrbSecrets(settings.noitaFolderPath);

  try {
    // orb系
    const orbSecretElements = getOrbSecretElements();
    orbSecretElements.forEach(async (checkboxElement, key) => {
      const orbFileName = orbsCardMappingList.filter((m) => m.flag === key).map((m) => m.orbsNew)[0];

      const orbFilePath = await path.join(settings.noitaFolderPath, NOITA_FLAG_EDITOR.ORBS_NEW_PATH, orbFileName);
      const flagFilePath = await path.join(settings.noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, key);

      if (checkboxElement.checked) {
        await writeTextFile(orbFilePath, "why are you looking here");
        await writeTextFile(flagFilePath, "why are you looking here");
      } else {
        if (await exists(orbFilePath)) {
          await removeFile(orbFilePath);
        }

        if (await exists(flagFilePath)) {
          await removeFile(flagFilePath);
        }
      }
    });

    // orb外
    const secretElements = getSecretElements();
    secretElements.forEach(async (checkboxElement, key) => {
      const flagFilePath = await path.join(settings.noitaFolderPath, NOITA_FLAG_EDITOR.FLAGS_PATH, key);

      if (checkboxElement.checked) {
        await writeTextFile(flagFilePath, "why are you looking here");
      } else {
        if (await exists(flagFilePath)) {
          await removeFile(flagFilePath);
        }
      }
    });
  } catch (error) {
    alert("フラグファイルの取得に失敗しています。想定されていないエラーなので、管理者へ連絡してください");
    console.error("Flagファイルの取得に失敗しました");
    throw error;
  }
};

export const saveFlagsButton = {
  click,
};
