import { loadAndSetFlags } from "../secret";

const execute = async (noitaFolderPath: string): Promise<void> => {
  await loadAndSetFlags(noitaFolderPath);
};

export const loadFlagsEvent = {
  execute,
};
