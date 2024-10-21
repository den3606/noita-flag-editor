import { NOITA_FLAG_EDITOR } from "../const";
import { loadJsonFile, saveJsonFile, selectTargetFile } from "../file";
import type { Settings } from "../interfaces/interfaces";

const click = async (event: Event) => {
  event.preventDefault();
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  const selectedFilePath = await selectTargetFile(settings.filePath);
  settings.filePath = selectedFilePath;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
  return settings.filePath;
};

export const noitaFolderSelectButton = {
  click,
};
