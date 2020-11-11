import resolve from "enhanced-resolve";
import fs from "fs";
import { glob } from "glob";
import path from "path";

import { PluginRawInstance } from "../../types";
import * as loaderIpc from "./loader-fs-ipc";

export class PluginLoaderFileSystem {
	#roots: string[];

	constructor(paths: string[]) {
		this.#roots = paths;
	}

	static ipc() {
		return loaderIpc;
	}

	search(): PluginRawInstance[] {
		const paths = this.findPathsByConfigFiles();
		const entries: PluginRawInstance[] = [];

		for (const dir of paths) {
			const configPath = path.join(dir, "package.json");
			const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

			const sourcePath = resolve.sync(dir, ".");

			/* istanbul ignore next */
			if (sourcePath) {
				const source = fs.readFileSync(sourcePath, "utf-8");

				entries.push({
					path: sourcePath,
					source,
					config,
				});
			}
		}

		return entries;
	}

	private findPathsByConfigFiles() {
		const files: string[] = [];

		for (const cwd of this.#roots) {
			const match = glob.sync("**/package.json", {
				cwd,
				nodir: true,
				absolute: true,
			});

			files.push(...match);
		}

		const paths = files.map((file) => path.dirname(file));

		return paths;
	}
}
