import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { Settings } from "../models/settings";
import { rewriteFiles } from "../rewrite-files";
import { startWatching } from "../start-watching";
import { now } from "../utils/date";
import { loadSettingsFile } from "../utils/file";

export class StartWatchingAutoRewriteEvent implements FlagEditorEvent {
  load(): void {
    const startWatchingElement = document.querySelector("#startWatching") as HTMLButtonElement;
    const monitorStatusElement = document.querySelector("#monitorStatus") as HTMLSpanElement;
    const endWatchingElement = document.querySelector("#endWatching") as HTMLButtonElement;
    const lastExecutedLogElement = document.querySelector("#lastExecutedLog") as HTMLSpanElement;

    startWatchingElement.addEventListener("click", async (event: Event) => {
      event.preventDefault();
      await startWatching.execute(startWatchingElement, endWatchingElement, monitorStatusElement, async () => {
        try {
          const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
          const validSettings = settings.validate();
          await rewriteFiles.execute(validSettings);
          lastExecutedLogElement.textContent = now();
          new Notify({
            text: "[自動]書き換えに成功しました",
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
              text: "[自動]書き換えに失敗しました。<br>フォルダの設定が正しいか確認してください。",
            });
          }
        }
      });

      endWatchingElement.disabled = false;
    });
  }
}

export const startWatchingAutoRewriteEvent = new StartWatchingAutoRewriteEvent();
