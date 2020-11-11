const { injectLoaderFilesystemHandler } = require("../plugins/loader/fs/loader-fs-ipc");

const setupPlugins = () => {
	injectLoaderFilesystemHandler();
};

module.exports = {
	setupPlugins,
};
