import { invoke } from "@tauri-apps/api/core";
import { listen, type Event as TauriEvent } from "@tauri-apps/api/event";
import Notify from "simple-notify";
import { MONITOR_STATUS } from "../const";
import type { GameStatus } from "../interfaces/backend";

const execute = async (
  startWatchingElement: HTMLButtonElement,
  endWatchingElement: HTMLButtonElement,
  monitorStatus: HTMLSpanElement,
  onDeathCallback: () => Promise<void>,
): Promise<void> => {
  startWatchingElement.disabled = true;
  monitorStatus.textContent = MONITOR_STATUS.CONNECTING;

  const unlisten = await listen("game-status", async (event: TauriEvent<GameStatus>) => {
    if (event.payload === "death") {
      await onDeathCallback();
      startWatchingElement.disabled = true;
      endWatchingElement.disabled = false;
    }

    if (event.payload === "connected") {
      new Notify({
        text: "接続に成功しました",
        status: "success",
      });
      startWatchingElement.disabled = true;
      endWatchingElement.disabled = false;
      monitorStatus.textContent = MONITOR_STATUS.CONNECTED;
    }

    if (event.payload === "close") {
      new Notify({
        text: "接続が終了しました",
        status: "info",
      });
      unlisten();
      startWatchingElement.disabled = false;
      endWatchingElement.disabled = true;
      monitorStatus.textContent = MONITOR_STATUS.COMPLETED;
    }

    if (event.payload === "timeout") {
      new Notify({
        text: "接続に失敗しました",
        status: "error",
      });
      unlisten();
      startWatchingElement.disabled = false;
      endWatchingElement.disabled = true;
      monitorStatus.textContent = MONITOR_STATUS.TIMEOUT;
    }
  });

  const executedText = await invoke("start_game_status_monitor").catch((error) => {
    console.error("Failed to start game status monitor:", error);
    unlisten();
    startWatchingElement.disabled = false;
    endWatchingElement.disabled = true;
    monitorStatus.textContent = MONITOR_STATUS.TIMEOUT;
  });
  console.info(executedText);
};

export const startWatchingEvent = {
  execute,
};
