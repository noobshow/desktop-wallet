const { PluginLoaderFileSystem } = require("../plugins/loader");

const setupPlugins = () => {
	PluginLoaderFileSystem.ipc().injectLoaderFilesystemHandler();
};

module.exports = {
	setupPlugins,
};
