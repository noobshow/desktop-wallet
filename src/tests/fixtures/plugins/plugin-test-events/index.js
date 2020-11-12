module.exports = (api) => {
	api.events().on("activated", () => console.log("plugin-test-events activated!"));
};
