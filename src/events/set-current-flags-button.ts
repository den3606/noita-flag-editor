import { invoke } from "@tauri-apps/api";
import type { EditFlagsButtonParams } from "../interfaces/event";

const click = async (event: Event, { orbSecret, secret, folderPath }: EditFlagsButtonParams): Promise<void> => {
  event.preventDefault();

  console.log(folderPath);

  // TODO:ファイルを元に、フラグのマップを返す
  // const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  // const selectedFilePath = await selectTargetFile(settings.filePath);
  // settings.filePath = selectedFilePath;
  // await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
};

export const setCurrentFlagsButton = {
  click,
};
