import { NOITA_FLAG_EDITOR } from "../const";
import { loadSettingsFile, saveJsonFile } from "../utils/file";

const execute = async (element: HTMLInputElement): Promise<void> => {
  const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
  settings.deleteBonesNew = element.checked;
  await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
};

export const deleteBonesNewEvent = {
  execute,
};
