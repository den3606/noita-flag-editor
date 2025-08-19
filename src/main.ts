import { getVersion } from "@tauri-apps/api/app";
import { NOITA_FLAG_EDITOR } from "./const";
import { loadAndSetFlags } from "./secret";
import { loadSettingsFile } from "./utils/file";
import "simple-notify/dist/simple-notify.css";
import { deleteBonesNewEvent } from "./events/delete-bones-new-event";
import { endWatchingAutoRewriteEvent } from "./events/end-watching-auto-rewrite-event copy";
import { loadFlagsEvent } from "./events/load-flags-event";
import { manualRewriteEvent } from "./events/manual-rewrite-event";
import { noitaFolderSelectEvent } from "./events/noita-folder-select-event";
import { startWatchingAutoRewriteEvent } from "./events/start-watching-auto-rewrite-event";

const init = async () => {
  const version = document.querySelector("#version") as HTMLInputElement;
  version.textContent = `v${await getVersion()}`;

  const settings = await loadSettingsFile(NOITA_FLAG_EDITOR.SETTINGS_FILE);
  try {
    const validSettings = settings.validate();

    // Set Target Folder
    const selectedNoitaFolderPathElement = document.querySelector("#selectedNoitaFolderPath") as HTMLSpanElement;
    selectedNoitaFolderPathElement.textContent = settings.noitaFolderPath;

    // Set Unlock Flags
    await loadAndSetFlags(validSettings.noitaFolderPath);
  } catch (error) {
    // 初回はNoitaFolderPathが定義されていないためwarnで定義
    console.warn(error);
  }

  // Set Bones New Flags
  const deleteBonesNewElement = document.querySelector("#deleteBonesNew") as HTMLInputElement;
  deleteBonesNewElement.checked = settings.deleteBonesNew;
};

const loadEvents = () => {
  // settings - read/write
  loadFlagsEvent.load();
  manualRewriteEvent.load();

  // settings - watch memory read/write
  startWatchingAutoRewriteEvent.load();
  endWatchingAutoRewriteEvent.load();

  // settings - folder
  noitaFolderSelectEvent.load();

  // settings - delete bones_new
  deleteBonesNewEvent.load();
};

const main = async () => {
  await init();
  loadEvents();
};

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
