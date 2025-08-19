import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { Settings } from "../models/settings";
import { loadAndSetFlags } from "../secret";
import { loadSettingsFile } from "../utils/file";

export class LoadFlagsEvent implements FlagEditorEvent {
  load(): void {
    const loadFlagsElement = document.querySelector("#loadFlags") as HTMLButtonElement;

    loadFlagsElement.addEventListener("click", async () => {
      const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);

      try {
        const validSettings = settings.validate();
        await loadAndSetFlags(validSettings.noitaFolderPath);
        new Notify({
          text: "読み込みに成功しました",
        });
      } catch (error) {
        const message = Settings.getTargetErrorMessage(error, "noitaFolderPath");
        new Notify({
          status: "error",
          text: message ?? "読み込みに失敗しました。<br>フォルダの設定が正しいか確認してください。",
        });
      }
    });
  }
}

export const loadFlagsEvent = new LoadFlagsEvent();
