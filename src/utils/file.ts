import type { OpenDialogOptions } from "@tauri-apps/plugin-dialog";
import * as dialog from "@tauri-apps/plugin-dialog";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { rawSettingsZ, Settings } from "../models/settings";

export interface FileItem {
  filePath: string;
  data: string | Uint8Array;
}

export interface BinaryFileItem extends FileItem {
  data: Uint8Array;
}

export interface TextFileItem extends FileItem {
  data: string;
}

const dialogOption = {
  filters: [
    {
      extensions: ["txt"],
      name: "テキストファイル",
    },
    {
      extensions: ["*"],
      name: "全てのファイル",
    },
  ],
};

export const loadTextFile = async (): Promise<TextFileItem> => {
  const filePath = await dialog.open({
    directory: false,
  });

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  const data = await readTextFile(filePath);

  return { filePath, data };
};

export const saveTextFile = async (text: string): Promise<void> => {
  const filePath = await dialog.save(dialogOption);

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  await writeTextFile(filePath, text);
};

export const selectTargetFile = async (filePath?: string): Promise<string> => {
  const options = ((): OpenDialogOptions => {
    if (filePath) {
      return {
        ...dialogOption,
        defaultPath: filePath,
      };
    }
    return dialogOption;
  })();
  const selectedFilePath = await dialog.open(options);

  if (typeof selectedFilePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  return selectedFilePath;
};

export const saveJsonFile = async (fileName: string, jsonData: object): Promise<void> => {
  try {
    // JSONデータを文字列に変換
    const jsonString = JSON.stringify(jsonData);

    // ファイルに書き込む
    await writeTextFile(fileName, jsonString, { baseDir: BaseDirectory.AppLocalData });
    console.log(`Data saved to ${fileName}`);
  } catch (error) {
    console.error("Failed to save file:", error);
  }
};

export const loadJsonFile = async (filename: string): Promise<object> => {
  try {
    // ファイルからテキストデータを読み込む
    const jsonString = await readTextFile(filename, { baseDir: BaseDirectory.AppLocalData });

    // 読み込んだテキストデータをJSONオブジェクトに変換
    const jsonData = JSON.parse(jsonString);

    console.log(`Data read from ${filename}:`, jsonData);
    return jsonData;
  } catch (error) {
    console.error("Failed to read file:", error);
    console.warn("ファイルがないため、空のオブジェクトを返却します");
    return {};
  }
};

export const loadSettingsFile = async (filename: string): Promise<Settings> => {
  try {
    const jsonObject = await loadJsonFile(filename);
    const rawSettings = rawSettingsZ.parse(jsonObject);
    return new Settings(rawSettings);
  } catch (error) {
    console.warn("Failed to read settings file: ", error);
    throw error;
  }
};
