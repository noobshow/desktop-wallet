import { ipcMain, ipcRenderer } from "electron";
import path from "path";

import { PluginRawInstance } from "../../types";
import { PluginLoaderFileSystem } from "./loader-fs";

export const invokeLoaderFileSystem = (): Promise<PluginRawInstance[]> =>
	ipcRenderer.invoke("plugin:loader.fs", [path.resolve(".plugins")]);

export const injectLoaderFilesystemHandler = () =>
	ipcMain.handle("plugin:loader.fs", (_, paths: string[]) => {
		const finder = new PluginLoaderFileSystem(paths);
		return finder.search();
	});
