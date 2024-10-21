import { NOITA_FLAG_EDITOR } from "../const";
import { loadJsonFile, saveJsonFile } from "../utils/file";
import type { Settings } from "../interfaces/setting";
import { selectFolder } from "../utils/folder";

const click = async (event: Event) => {
  event.preventDefault();
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  const selectedFolderPath = await selectFolder();
  settings.noitaFolderPath = selectedFolderPath;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
  return settings.noitaFolderPath;
};

export const noitaFolderSelectButton = {
  click,
};
