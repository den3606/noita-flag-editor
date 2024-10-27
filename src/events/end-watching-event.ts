import { invoke } from "@tauri-apps/api/core";

const execute = async (event: Event) => {
  event.preventDefault();
  const endWatching = event.target as HTMLButtonElement;
  endWatching.disabled = true;
  await invoke("stop_game_status_monitor").catch((error) => {
    console.error("Failed to start game status monitor:", error);
  });
};

export const endWatchingEvent = {
  execute,
};
