import { invoke } from "@tauri-apps/api";
import type { StartButtonParams } from "../interfaces/event";
import type { MonitorStatus } from "../interfaces/memory";

const click = async (event: Event, { monitorStatus, folderPath }: StartButtonParams) => {
  console.log(folderPath);
  event.preventDefault();

  const startWatching = event.target as HTMLButtonElement;
  startWatching.disabled = true;
  monitorStatus.textContent = "接続中";

  const response = (await invoke("start_game_status_monitor", { folderPath }).catch((error) => {
    console.error("Failed to start game status monitor:", error);
  })) as MonitorStatus;

  if (response === "close") {
    monitorStatus.textContent = "接続終了";
  }

  if (response === "timeout") {
    monitorStatus.textContent = "接続切れ";
  }

  if (response === "undefined") {
    monitorStatus.textContent = "未定義レスポンス";
    console.warn("undefined");
  }
  startWatching.disabled = false;
};

export const startWatchingButton = {
  click,
};
