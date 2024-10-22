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

async function main() {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  let noitaFolderPath = settings.noitaFolderPath;

  await loadAndSetFlags(settings);

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
  const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;

  const saveFlagsAction = async () => {
    await saveFlagsEvent.execute(settings);
    lastExecutedLogElement.textContent = now();
  };

  // execute
  loadFlagsElement.addEventListener("click", async () => {
    loadFlagsEvent.execute(settings);
    new Notify({
      text: "読み込みに成功しました",
    });
  });
  saveFlagsElement.addEventListener("click", async () => {
    await saveFlagsAction();
    new Notify({
      text: "書き換えに成功しました",
    });
  });

  // settings - watch memory
  startWatchingElement.addEventListener("click", async (event: Event) => {
    await startWatchingEvent.execute(event, monitorStatusElement, async () => {
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
    selectedNoitaFolderPathElement.textContent = newFolderPath;
    noitaFolderPath = newFolderPath;
  });

  if (noitaFolderPath != null) {
    selectedNoitaFolderPathElement.textContent = noitaFolderPath;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
