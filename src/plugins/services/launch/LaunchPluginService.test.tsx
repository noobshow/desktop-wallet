import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import React from "react";
import { env, render, screen } from "utils/testing-library";

import { LaunchRender } from "./LaunchPluginComponent";
import { LaunchPluginService } from "./LaunchPluginService";

const meta = { id: 1, name: "test", version: "1.1", permissions: ["LAUNCH"], urls: [], isEnabled: true };
const fixture = (api: PluginAPI) => api.launch().render(<h1>My Plugin</h1>);

describe("LaunchPluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new LaunchPluginService()]);

		// Enable plugin
		profile.plugins().push(meta);

		ctrl = new PluginController(meta, fixture, manager.services());
	});

	it("should render", () => {
		ctrl.boot(profile);

		const Component = () => <LaunchRender manager={manager} pluginId={ctrl.id()} />;

		render(<Component />);
		expect(screen.getByText("My Plugin"));
	});

	it("should render fallback", () => {
		const Component = () => <LaunchRender manager={manager} pluginId={ctrl.id()} fallback={<h1>Not Loaded</h1>} />;

		render(<Component />);
		expect(screen.getByText("Not Loaded"));
	});
});
