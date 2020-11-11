const React = require("react");

const Page = () => React.createElement("h1", null, "My Exchange Plugin");

module.exports = (api) => {
	api.events().on("activated", () => {
		api.http().get("https://dexplorer.ark.io/api/transactions").then(console.log);
	});

	api.launch().render(Page());
};
