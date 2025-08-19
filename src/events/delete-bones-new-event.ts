import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { loadSettingsFile, saveJsonFile } from "../utils/file";

export class DeleteBonesNewEvent implements FlagEditorEvent {
  load(): void {
    const deleteBonesNewElement = document.querySelector("#deleteBonesNew") as HTMLInputElement;

    deleteBonesNewElement.addEventListener("change", async () => {
      const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
      settings.deleteBonesNew = deleteBonesNewElement.checked;
      await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
    });
  }
}

export const deleteBonesNewEvent = new DeleteBonesNewEvent();
