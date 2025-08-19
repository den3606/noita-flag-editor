import { invoke } from "@tauri-apps/api/core";
import Notify from "simple-notify";
import { NOITA_FLAG_EDITOR } from "../const";
import { FlagEditorEvent } from "../interfaces/event";
import { Settings } from "../models/settings";
import { rewriteFiles } from "../rewrite-files";
import { startWatching } from "../start-watching";
import { now } from "../utils/date";
import { loadSettingsFile } from "../utils/file";

export class EndWatchingAutoRewriteEvent implements FlagEditorEvent {
  load(): void {
    const endWatchingElement = document.querySelector("#endWatching") as HTMLButtonElement;
    const startWatchingElement = document.querySelector("#startWatching") as HTMLButtonElement;

    endWatchingElement.addEventListener("click", async (event: Event) => {
      event.preventDefault();
      const endWatching = event.target as HTMLButtonElement;
      endWatching.disabled = true;
      await invoke("stop_game_status_monitor").catch((error) => {
        console.error("Failed to start game status monitor:", error);
      });
      startWatchingElement.disabled = false;
    });
  }
}

export const endWatchingAutoRewriteEvent = new EndWatchingAutoRewriteEvent();
