import type { Settings } from "../interfaces/setting";
import { loadAndSetFlags } from "../secret";

const execute = async (settings: Settings): Promise<void> => {
  await loadAndSetFlags(settings);
};

export const loadFlagsEvent = {
  execute,
};
