const React = require("React");

const Page = () => React.createElement("h1", null, "My Exchange Plugin");

module.exports = (api) => {
	api.events().on("activated", () => {
		const wallets = api.profile().wallets();
		console.log(wallets);
	});

	api.events().reduce("components:test", (text) => React.createElement("button", null, text));

	api.http().get("https://dexplorer.ark.io/api/transactions").then(console.log);
	api.launch().render(Page());
};
