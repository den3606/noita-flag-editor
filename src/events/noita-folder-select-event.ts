import { NOITA_FLAG_EDITOR } from "../const";
import { loadSettingsFile, saveJsonFile } from "../utils/file";
import { selectFolder } from "../utils/folder";

const execute = async (): Promise<string> => {
  const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
  const selectedFolderPath = await selectFolder();
  settings.noitaFolderPath = selectedFolderPath;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
  return settings.noitaFolderPath;
};

export const noitaFolderSelectEvent = {
  execute,
};
