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
import { rewriteEvent } from "./events/rewrite-event";
import { startWatchingEvent } from "./events/start-watching-event";
import { deleteBonesNewEvent } from "./events/delete-bones-new-event";

const init = async () => {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;

  // Set Target Folder
  if (settings.noitaFolderPath != null) {
    const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;
    selectedNoitaFolderPathElement.textContent = settings.noitaFolderPath;
  }

  // Set Unlock Flags
  await loadAndSetFlags(settings.noitaFolderPath);

  // Set Bones New Flags
  const deleteBonesNewElement = document.querySelector("#deleteBonesNew") as HTMLInputElement;
  deleteBonesNewElement.checked = settings.deleteBonesNew;
};

const main = async () => {
  init();

  // tags
  const lastExecutedLogElement = document.querySelector("#lastExecutedLog") as HTMLSpanElement;
  const monitorStatusElement = document.querySelector("#monitorStatus") as HTMLSpanElement;
  // rewrite flags
  const loadFlagsElement = document.querySelector("#loadFlags") as HTMLButtonElement;
  const rewriteElement = document.querySelector("#rewriteFlags") as HTMLButtonElement;
  // watch memory
  const startWatchingElement = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatchingElement = document.querySelector("#endWatching") as HTMLButtonElement;
  // folder setting
  const noitaFolderSelectElement = document.querySelector("#noitaFolderSelect") as HTMLButtonElement;
  // delete bones_new
  const deleteBonesNewElement = document.querySelector("#deleteBonesNew") as HTMLInputElement;

  const saveFlagsAction = async () => {
    const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
    await rewriteEvent.execute(settings);
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
  rewriteElement.addEventListener("click", async () => {
    try {
      const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
      await rewriteEvent.execute(settings);
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

  // settings - delete bones_new
  deleteBonesNewElement.addEventListener("change", async () => {
    await deleteBonesNewEvent.execute(deleteBonesNewElement);
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
