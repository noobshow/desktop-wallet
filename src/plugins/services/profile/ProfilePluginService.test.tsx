import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env } from "utils/testing-library";

import { ProfilePluginService } from "./ProfilePluginService";

const meta = { id: 1, name: "test", version: "1.1", permissions: ["PROFILE"], urls: [], isEnabled: true };

describe("StorePluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new ProfilePluginService()]);
		manager.services().boot();

		// Enable plugin
		profile.plugins().push(meta);
	});

	it("should get wallets", () => {
		let wallets;

		const fixture = (api: PluginAPI) => {
			wallets = api.profile().wallets();
		};

		ctrl = new PluginController(meta, fixture, manager.services());

		manager.plugins().push(ctrl);
		manager.plugins().boot(profile);

		expect(wallets).toHaveLength(2);
		// @ts-ignore
		expect(wallets[0].address).toBe("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
	});
});
