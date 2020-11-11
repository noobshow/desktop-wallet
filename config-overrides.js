const {
	override,
	addPostcssPlugins,
	addWebpackAlias,
	addWebpackExternals,
	addWebpackPlugin,
	setWebpackTarget,
	addWebpackModuleRule,
} = require("customize-cra");
const nodeExternals = require("webpack-node-externals");

const addNodeExternals = () =>
	addWebpackExternals([
		nodeExternals({
			allowlist: [/tippy/, /swiper/, "isomorphic-fetch"],
		}),
	]);

const injectTailwindCSS = () =>
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]);

module.exports = override(
	setWebpackTarget("electron-renderer"),
	injectTailwindCSS(),
	addNodeExternals(),
	addWebpackAlias({
		"@arkecosystem/crypto": "@arkecosystem/crypto/dist/index.esm.js",
	}),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
