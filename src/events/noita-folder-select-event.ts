import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { Settings } from "../models/settings";
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

      try {
        settings.validate();
      } catch (error: unknown) {
        const message = Settings.getTargetErrorMessage(error, "noitaFolderPath");
        if (message) {
          new Notify({
            status: "error",
            text: message,
          });
        } else {
          new Notify({
            status: "error",
            text: "想定されていないエラーです。<br>管理者へ連絡してください",
          });
        }
        return;
      }

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
