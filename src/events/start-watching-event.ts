import { invoke } from "@tauri-apps/api";
import { type Event as TauriEvent, listen } from "@tauri-apps/api/event";
import Notify from "simple-notify";
import { MONITOR_STATUS } from "../const";
import type { GameStatus } from "../interfaces/backend";

const execute = async (
  event: Event,
  monitorStatus: HTMLSpanElement,
  onDeathCallback: () => Promise<void>,
): Promise<void> => {
  event.preventDefault();
  const startWatching = event.target as HTMLButtonElement;
  startWatching.disabled = true;
  monitorStatus.textContent = MONITOR_STATUS.CONNECTING;

  const unlisten = await listen("game-status", async (event: TauriEvent<GameStatus>) => {
    if (event.payload === "death") {
      await onDeathCallback();
      startWatching.disabled = true;
    }

    if (event.payload === "connected") {
      new Notify({
        text: "接続に成功しました",
        status: "success",
      });
      startWatching.disabled = true;
      monitorStatus.textContent = MONITOR_STATUS.CONNECTED;
    }

    if (event.payload === "close") {
      new Notify({
        text: "接続が終了しました",
        status: "info",
      });
      unlisten();
      monitorStatus.textContent = MONITOR_STATUS.COMPLETED;
      startWatching.disabled = false;
    }

    if (event.payload === "timeout") {
      new Notify({
        text: "接続に失敗しました",
        status: "error",
      });
      unlisten();
      monitorStatus.textContent = MONITOR_STATUS.TIMEOUT;
      startWatching.disabled = false;
    }
  });

  const executedText = await invoke("start_game_status_monitor").catch((error) => {
    console.error("Failed to start game status monitor:", error);
    unlisten();
  });
  console.info(executedText);
};

export const startWatchingEvent = {
  execute,
};
