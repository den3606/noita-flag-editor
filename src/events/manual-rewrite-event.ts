import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { Settings } from "../models/settings";
import { rewriteFiles } from "../rewrite-files";
import { now } from "../utils/date";
import { loadSettingsFile } from "../utils/file";

export class ManualRewriteEvent implements FlagEditorEvent {
  load(): void {
    const rewriteFlagsElement = document.querySelector("#rewriteFlags") as HTMLButtonElement;
    const lastExecutedLogElement = document.querySelector("#lastExecutedLog") as HTMLSpanElement;

    rewriteFlagsElement.addEventListener("click", async () => {
      const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);

      try {
        const validSettings = settings.validate();
        rewriteFiles.execute(validSettings);
        new Notify({
          text: "書き換えに成功しました",
        });
      } catch (e) {
        const message = Settings.getTargetErrorMessage(e, "noitaFolderPath");
        if (message) {
          console.error(message);
          new Notify({
            status: "error",
            text: message,
          });
        } else {
          console.error(e);
          new Notify({
            status: "error",
            text: "書き換えに失敗しました。<br>フォルダの設定が正しいか確認してください。",
          });
        }
      }
      lastExecutedLogElement.textContent = now();
    });
  }
}

export const manualRewriteEvent = new ManualRewriteEvent();
