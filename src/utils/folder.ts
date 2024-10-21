import { dialog } from "@tauri-apps/api";

export const selectFolder = async (): Promise<string> => {
  const filePath = await dialog.open({
    directory: true,
  });

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  return filePath;
};
