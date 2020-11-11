const path = require("path");

module.exports = {
	output: {
		path: path.resolve("build/electron"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								["@babel/preset-env", { targets: { node: "current" } }],
								"@babel/preset-typescript",
							],
							plugins: ["@babel/plugin-proposal-class-properties"],
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".js", ".ts"],
	},
};
