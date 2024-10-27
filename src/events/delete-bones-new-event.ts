import { NOITA_FLAG_EDITOR } from "../const";
import type { Settings } from "../interfaces/setting";
import { loadJsonFile, saveJsonFile } from "../utils/file";

const execute = async (element: HTMLInputElement): Promise<void> => {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  settings.deleteBonesNew = element.checked;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
};

export const deleteBonesNewEvent = {
  execute,
};
