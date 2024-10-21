import type { Settings } from "../interfaces/setting";
import { loadAndSetFlags } from "../secret";

const click = async (event: Event, settings: Settings): Promise<void> => {
  event.preventDefault();

  await loadAndSetFlags(settings);
};

export const loadFlagsButton = {
  click,
};
