import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "./const";
import type { Settings } from "./interfaces/setting";
import { loadAndSetFlags } from "./secret";
import { now } from "./utils/date";
import { loadJsonFile } from "./utils/file";
import "simple-notify/dist/simple-notify.css";
import { endWatchingEvent } from "./events/end-watching-event";
import { loadFlagsEvent } from "./events/load-flags-event";
import { noitaFolderSelectEvent } from "./events/noita-folder-select-event";
import { saveFlagsEvent } from "./events/save-flags-event";
import { startWatchingEvent } from "./events/start-watching-event";

const init = async () => {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  await loadAndSetFlags(settings.noitaFolderPath);

  if (settings.noitaFolderPath != null) {
    const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;
    selectedNoitaFolderPathElement.textContent = settings.noitaFolderPath;
  }
};

const main = async () => {
  init();

  // tags
  const lastExecutedLogElement = document.querySelector("#lastExecutedLog") as HTMLSpanElement;
  const monitorStatusElement = document.querySelector("#monitorStatus") as HTMLSpanElement;
  // rewrite flags
  const loadFlagsElement = document.querySelector("#loadFlags") as HTMLButtonElement;
  const saveFlagsElement = document.querySelector("#saveFlags") as HTMLButtonElement;
  // watch memory
  const startWatchingElement = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatchingElement = document.querySelector("#endWatching") as HTMLButtonElement;
  // folder setting
  const noitaFolderSelectElement = document.querySelector("#noitaFolderSelect") as HTMLButtonElement;

  const saveFlagsAction = async () => {
    const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
    await saveFlagsEvent.execute(settings);
    lastExecutedLogElement.textContent = now();
  };

  /* Events */
  // execute
  loadFlagsElement.addEventListener("click", async () => {
    try {
      const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
      loadFlagsEvent.execute(settings.noitaFolderPath);
      new Notify({
        text: "読み込みに成功しました",
      });
    } catch (_e) {
      new Notify({
        status: "error",
        text: "読み込みに失敗しました",
      });
    }
  });
  saveFlagsElement.addEventListener("click", async () => {
    try {
      await saveFlagsAction();
      new Notify({
        text: "書き換えに成功しました",
      });
    } catch (_e) {
      new Notify({
        status: "error",
        text: "書き換えに失敗しました",
      });
    }
  });

  // settings - watch memory
  startWatchingElement.addEventListener("click", async (event: Event) => {
    event.preventDefault();
    await startWatchingEvent.execute(startWatchingElement, endWatchingElement, monitorStatusElement, async () => {
      await saveFlagsAction();
      new Notify({
        text: "自動的な書き換えに成功しました",
      });
    });
    endWatchingElement.disabled = false;
  });
  endWatchingElement.addEventListener("click", async (event: Event) => {
    endWatchingEvent.execute(event);
    startWatchingElement.disabled = false;
  });

  // settings - folder
  noitaFolderSelectElement.addEventListener("click", async () => {
    const newFolderPath = await noitaFolderSelectEvent.execute();
    const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;
    selectedNoitaFolderPathElement.textContent = newFolderPath;
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
