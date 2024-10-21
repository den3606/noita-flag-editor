import { NOITA_FLAG_EDITOR } from "./const";
import { now } from "./date";
import { editFlagsButton } from "./events/edit-flags-button";
import { endWatchingButton } from "./events/end-watching-button";
import { noitaFolderSelectButton } from "./events/noita-folder-select-button";
import { startWatchingButton } from "./events/start-watching-button";
import { loadJsonFile } from "./file";
import { getOrbSecretElements, getSecretElements } from "./get-html-element";
import type { EditFlagsButtonParams } from "./interfaces/event";
import type { Settings } from "./interfaces/interfaces";

async function main() {
  const settings: Settings = (await loadJsonFile(NOITA_FLAG_EDITOR.SETTINGS_FILE)) as Settings;
  let filePath = settings.filePath;

  // tags
  const lastExecutedLog = document.querySelector("#lastExecutedLog") as HTMLSpanElement;
  const monitorStatus = document.querySelector("#monitorStatus") as HTMLSpanElement;

  // rewrite flags
  const editFlags = document.querySelector("#editFlags") as HTMLButtonElement;
  editFlags.addEventListener("click", async (event: Event) => {
    const editFlagsButtonParams: EditFlagsButtonParams = {
      orbSecret: getOrbSecretElements(),
      secret: getSecretElements(),
      folderPath: "",
    };
    await editFlagsButton.click(event, editFlagsButtonParams);
    lastExecutedLog.innerHTML = now();
  });

  const setCurrentFlags = document.querySelector("setCurrentFlags") as HTMLButtonElement;
  setCurrentFlags.addEventListener("click", async (event: Event) => {
    endWatchingButton.click(event);
  });

  // watch memory
  const startWatching = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatching = document.querySelector("#endWatching") as HTMLButtonElement;
  startWatching.addEventListener("click", async (event: Event) => {
    startWatchingButton.click(event, { monitorStatus, filePath });
  });
  endWatching.addEventListener("click", async (event: Event) => {
    endWatchingButton.click(event);
  });

  // folder setting
  const noitaFolderSelect = document.querySelector("#noitaFolderSelect") as HTMLButtonElement;
  noitaFolderSelect.addEventListener("click", async (event: Event) => {
    const newFilePath = await noitaFolderSelectButton.click(event);
    filePath = newFilePath;
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
