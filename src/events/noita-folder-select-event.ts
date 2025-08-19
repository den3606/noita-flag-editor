import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { loadSettingsFile, saveJsonFile } from "../utils/file";
import { selectFolder } from "../utils/folder";

export class NoitaFolderSelectEvent implements FlagEditorEvent {
  load(): void {
    const noitaFolderSelectElement = document.querySelector("#noitaFolderSelect") as HTMLButtonElement;
    const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;

    noitaFolderSelectElement.addEventListener("click", async () => {
      const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
      const selectedFolderPath = await selectFolder();
      settings.noitaFolderPath = selectedFolderPath;
      await saveJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE, settings);
      const newFolderPath = settings.noitaFolderPath;

      new Notify({
        status: "success",
        text: "設定が完了しました",
      });

      selectedNoitaFolderPathElement.textContent = newFolderPath;
    });
  }
}

export const noitaFolderSelectEvent = new NoitaFolderSelectEvent();
