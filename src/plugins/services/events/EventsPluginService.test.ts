import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env } from "utils/testing-library";

import { EventsPluginService } from "./EventsPluginService";

const meta = {
	id: 1,
	name: "test",
	version: "1.1",
	"desktop-wallet": { permissions: ["EVENTS"], urls: [] },
	isEnabled: true,
};

describe("EventsPluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new EventsPluginService()]);
		manager.services().boot();

		// Enable plugin
		profile.plugins().push(meta);
	});

	it("should listen for events", () => {
		let ready = false;

		const fixture = (api: PluginAPI) => {
			api.events().on("activated", () => (ready = true));
		};

		ctrl = new PluginController(meta, fixture, manager.services());

		manager.plugins().push(ctrl);
		manager.plugins().boot(profile);

		expect(ready).toBe(true);
	});
});
