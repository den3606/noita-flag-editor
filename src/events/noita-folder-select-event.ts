import { NOITA_FLAG_EDITOR } from "../const";
import type { Settings } from "../interfaces/setting";
import { loadJsonFile, saveJsonFile } from "../utils/file";
import { selectFolder } from "../utils/folder";

const execute = async (): Promise<string> => {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  const selectedFolderPath = await selectFolder();
  settings.noitaFolderPath = selectedFolderPath;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
  return settings.noitaFolderPath;
};

export const noitaFolderSelectEvent = {
  execute,
};
