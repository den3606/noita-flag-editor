import { MONITOR_STATUS, NOITA_FLAG_EDITOR } from "./const";
import { now } from "./utils/date";
import { loadAndSetFlags } from "./secret";
import { endWatchingButton } from "./events/end-watching-button";
import { noitaFolderSelectButton } from "./events/noita-folder-select-button";
import { startWatchingButton } from "./events/start-watching-button";
import { loadJsonFile } from "./utils/file";
import type { Settings } from "./interfaces/setting";
import { loadFlagsButton } from "./events/load-flags-button";
import { saveFlagsButton } from "./events/save-flags-button";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

async function main() {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  let noitaFolderPath = settings.noitaFolderPath;

  await loadAndSetFlags(settings);

  // tags
  const lastExecutedLog = document.querySelector("#lastExecutedLog") as HTMLSpanElement;
  const monitorStatus = document.querySelector("#monitorStatus") as HTMLSpanElement;
  // rewrite flags
  const loadFlags = document.querySelector("#loadFlags") as HTMLButtonElement;
  const saveFlags = document.querySelector("#saveFlags") as HTMLButtonElement;
  // watch memory
  const startWatching = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatching = document.querySelector("#endWatching") as HTMLButtonElement;
  // folder setting
  const noitaFolderSelect = document.querySelector("#noitaFolderSelect") as HTMLButtonElement;
  const selectedNoitaFolderPath = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;

  const saveFlagsButtonAction = async (event: Event) => {
    await saveFlagsButton.click(event, settings);
    lastExecutedLog.textContent = now();
  };

  // execute
  loadFlags.addEventListener("click", async (event: Event) => {
    loadFlagsButton.click(event, settings);
    new Notify({
      text: "読み込みに成功しました",
    });
  });
  saveFlags.addEventListener("click", async (event: Event) => {
    await saveFlagsButtonAction(event);
    new Notify({
      text: "書き換えに成功しました",
    });
  });

  // settings - watch memory
  startWatching.addEventListener("click", async (event: Event) => {
    await startWatchingButton.click(event, monitorStatus, async () => {
      await saveFlagsButtonAction(event);
      new Notify({
        text: "自動的な書き換えに成功しました",
      });
    });
    endWatching.disabled = false;
  });
  endWatching.addEventListener("click", async (event: Event) => {
    endWatchingButton.click(event);
    startWatching.disabled = false;
  });

  // settings - folder
  noitaFolderSelect.addEventListener("click", async (event: Event) => {
    const newFolderPath = await noitaFolderSelectButton.click(event);
    selectedNoitaFolderPath.textContent = newFolderPath;
    noitaFolderPath = newFolderPath;
  });

  if (noitaFolderPath != null) {
    selectedNoitaFolderPath.textContent = noitaFolderPath;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
