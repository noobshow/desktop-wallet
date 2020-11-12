import { ipcMain, ipcRenderer } from "electron";
import os from "os";
import path from "path";

import { PluginRawInstance } from "../../types";
import { PluginLoaderFileSystem } from "./loader-fs";

export const invoke = (): Promise<PluginRawInstance[]> => ipcRenderer.invoke("plugin:loader-fs");

export const injectHandler = () => {
	const isDev = require("electron-is-dev");

	ipcMain.handle("plugin:loader-fs", () => {
		const paths: string[] = [];

		if (isDev) {
			paths.push(path.resolve("src/tests/fixtures/plugins"));
		}

		paths.push(path.resolve(os.homedir(), ".ark-desktop-v3", "plugins"));

		const finder = new PluginLoaderFileSystem(paths);
		return finder.search();
	});
};
