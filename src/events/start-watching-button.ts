import { invoke } from "@tauri-apps/api";
import type { MonitorStatus, StartButtonParams } from "../interfaces/interfaces";

const click = async (event: Event, { monitorStatus, filePath }: StartButtonParams) => {
  console.log(filePath);
  event.preventDefault();

  const startWatching = event.target as HTMLButtonElement;
  startWatching.disabled = true;
  monitorStatus.textContent = "接続中";

  const response = (await invoke("start_game_status_monitor", { filePath }).catch((error) => {
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
