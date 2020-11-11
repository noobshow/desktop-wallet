import path from "path";

import { PluginLoaderFileSystem } from "./loader-fs";

describe("PluginLoaderFileSystem", () => {
	let subject: PluginLoaderFileSystem;
	let root: string;

	beforeEach(() => {
		root = path.resolve("src/tests/fixtures/plugins");
		subject = new PluginLoaderFileSystem([root]);
	});

	it("should find manifests file in the folder", () => {
		expect(subject.search()).toMatchObject([
			{
				config: {
					id: 1,
					name: "plugin-my-exchange",
					permissions: ["HTTP"],
					urls: ["https://dexplorer.ark.io"],
				},
				path: path.join(root, "plugin-my-exchange", "index.js"),
				source: expect.any(String),
			},
		]);
	});
});
