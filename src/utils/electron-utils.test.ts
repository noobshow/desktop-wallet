import electron from "electron";

import { exitApp, isIdle, openExternal, openFile, saveFile, setScreenshotProtection } from "./electron-utils";

jest.mock("electron", () => {
	const setContentProtection = jest.fn();

	return {
		ipcRenderer: {
			invoke: jest.fn(),
			on: jest.fn(),
			handle: jest.fn(),
			send: jest.fn(),
			removeListener: jest.fn(),
		},
		remote: {
			dialog: {
				showOpenDialog: jest.fn(),
				showSaveDialog: jest.fn(),
			},
			getCurrentWindow: () => ({
				setContentProtection,
			}),
			powerMonitor: {
				getSystemIdleTime: jest.fn(),
			},
		},
		shell: {
			openExternal: jest.fn(),
		},
		ipcRenderer: {
			send: jest.fn(),
		},
	};
});

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn(),
}));

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

describe("Electron utils", () => {
	describe("setScreenshotProtection", () => {
		it("should toggle", () => {
			const setContentProtectionMock = jest
				.spyOn(electron.remote.getCurrentWindow(), "setContentProtection")
				.mockImplementation();

			setScreenshotProtection(true);

			expect(setContentProtectionMock).toHaveBeenNthCalledWith(1, true);

			setContentProtectionMock.mockClear();
			setScreenshotProtection(false);

			expect(setContentProtectionMock).toHaveBeenNthCalledWith(1, false);

			setContentProtectionMock.mockRestore();
		});
	});

	describe("saveFile", () => {
		let showSaveDialogMock: jest.SpyInstance;

		beforeEach(() => {
			showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
				filePath: "filePath",
			}));
		});

		afterEach(() => {
			showSaveDialogMock.mockRestore();
		});

		it("should return early when the obtained filePath is falsy", async () => {
			showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
				filePath: undefined,
			}));

			await expect(saveFile()).resolves.toEqual(undefined);
		});

		it("should return the basename", async () => {
			showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
				filePath: "directory/filename.txt",
			}));

			await expect(saveFile("raw", "directory/filename", { returnBasename: true })).resolves.toEqual(
				"filename.txt",
			);
		});

		describe("with filter parameter", () => {
			it("should parse a single FileFilter correctly", async () => {
				await saveFile("raw", "path", { filters: defaultFilters[0] });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: [defaultFilters[0]],
				});
			});

			it("should parse an array of FileFilters correctly", async () => {
				await saveFile("raw", "path", { filters: [defaultFilters[1]] });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: [defaultFilters[1]],
				});
			});

			it.each([null, undefined])("should fallback to the default filters when filters is %s", async (filters) => {
				await saveFile("raw", "path", { filters });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: defaultFilters,
				});
			});
		});

		describe("when restricting the file path", () => {
			it("should not throw an error if the given filepath is valid", async () => {
				showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
					filePath: "/home/foo/bar",
				}));

				await expect(saveFile(null, null, { restrictToPath: "/home/foo" })).resolves.not.toThrow();
			});

			it("should throw an error if the given filepath is invalid", async () => {
				showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
					filePath: "/home/bar/foo",
				}));

				await expect(saveFile(null, null, { restrictToPath: "/home/foo" })).rejects.toThrow();
			});
		});
	});

	describe("openFile", () => {
		let showOpenDialogMock: jest.SpyInstance;

		beforeEach(() => {
			showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
				filePaths: ["filePath"],
			}));
		});

		afterEach(() => {
			showOpenDialogMock.mockRestore();
		});

		it("should return early when the obtained filePaths is falsy", async () => {
			showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
				filePaths: undefined,
			}));

			await expect(openFile()).resolves.toEqual(undefined);
		});

		describe("with filter parameter", () => {
			it("should parse a single FileFilter correctly", async () => {
				await openFile("path", { filters: defaultFilters[0] });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: [defaultFilters[0]],
				});
			});

			it("should parse an array of FileFilters correctly", async () => {
				await openFile("path", { filters: [defaultFilters[1]] });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: [defaultFilters[1]],
				});
			});

			it.each([null, undefined])("should fallback to the default filters when filters is %s", async (filters) => {
				await openFile("path", { filters });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: defaultFilters,
				});
			});
		});

		describe("when restricting the file path", () => {
			it("should not throw an error if the given filepath is valid", async () => {
				showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
					filePaths: ["/home/foo/bar"],
				}));

				await expect(openFile(null, { restrictToPath: "/home/foo" })).resolves.not.toThrow();
			});

			it("should throw an error if the given filepath is invalid", async () => {
				showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
					filePaths: ["/home/bar/foo"],
				}));

				await expect(openFile(null, { restrictToPath: "/home/foo" })).rejects.toThrow();
			});
		});
	});

	describe("openExternal", () => {
		const externalLink = "https://ark.io";
		let openExternalMock: jest.SpyInstance;

		beforeEach(() => {
			openExternalMock = jest.spyOn(electron.shell, "openExternal").mockImplementation();
		});

		afterEach(() => {
			openExternalMock.mockRestore();
		});

		it("should open an external link", () => {
			openExternal(externalLink);
			expect(openExternalMock).toHaveBeenCalledWith(externalLink);
		});
	});

	describe("exitApp", () => {
		let ipcRendererMock: jest.SpyInstance;

		beforeEach(() => {
			ipcRendererMock = jest.spyOn(electron.ipcRenderer, "send").mockImplementation();
		});

		afterEach(() => {
			ipcRendererMock.mockRestore();
		});

		it("should quit electron app", () => {
			exitApp();
			expect(ipcRendererMock).toHaveBeenCalledWith("exit-app");
		});
	});

	describe("isIdle", () => {
		let getSystemIdleTimeMock: jest.SpyInstance;

		beforeEach(() => {
			getSystemIdleTimeMock = jest
				.spyOn(electron.remote.powerMonitor, "getSystemIdleTime")
				.mockImplementation(() => 60);
		});

		afterEach(() => {
			getSystemIdleTimeMock.mockRestore();
		});

		it("should return false if threshold is greater than idle time", () => {
			expect(isIdle(62)).toBe(false);
		});

		it("should return true if threshold is smaller than idle time", () => {
			expect(isIdle(10)).toBe(true);
		});
	});
});
