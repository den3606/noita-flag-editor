import { invoke } from "@tauri-apps/api";
import type { EditFlagsButtonParams } from "../interfaces/event";

const click = async (event: Event, { orbSecret, secret, folderPath }: EditFlagsButtonParams): Promise<void> => {
  event.preventDefault();

  console.log(folderPath);

  // TODO:値を元にファイルを生成、削除する処理
  // const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  // const selectedFilePath = await selectTargetFile(settings.filePath);
  // settings.filePath = selectedFilePath;
  // await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
};

export const editFlagsButton = {
  click,
};
