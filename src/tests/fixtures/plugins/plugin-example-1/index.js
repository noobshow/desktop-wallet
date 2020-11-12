module.exports = (api) => {
	api.events().on("activated", () => console.log("plugin-example-1 activated!"));
};
