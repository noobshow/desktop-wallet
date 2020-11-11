const React = require("React");

const Page = () => React.createElement("h1", null, "My Exchange Plugin");

module.exports = (api) => {
	api.launch().render(Page());
};
