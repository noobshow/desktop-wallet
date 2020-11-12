import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { runUnknownCode } from "plugins/loader";

import { PluginRawInstance } from "../types";
import { PluginController } from "./plugin-controller";
import { PluginServiceRepository } from "./plugin-service-repository";

export class PluginControllerRepository {
	#plugins: PluginController[] = [];
	#services: PluginServiceRepository;

	constructor(serviceRepository: PluginServiceRepository) {
		this.#services = serviceRepository;
	}

	all() {
		return this.#plugins;
	}

	findById(id: number) {
		return this.#plugins.find((item) => item.id() === id);
	}

	boot(profile: Profile) {
		this.#services.hooks().emit("profile", profile);

		const enabledPlugins = profile
			.plugins()
			.values()
			.filter((item) => item.isEnabled);

		for (const plugin of enabledPlugins) {
			const ctrl = this.findById(plugin.id);
			ctrl?.boot(profile);
		}
	}

	push(instance: PluginController) {
		this.#plugins.push(instance);
	}

	fill(instances: PluginRawInstance[]) {
		const plugins: PluginController[] = [];

		for (const entry of instances) {
			const callback = runUnknownCode(entry.source, entry.path);
			const plugin = new PluginController(
				entry.config,
				// @ts-ignore
				callback,
				this.#services,
			);

			plugins.push(plugin);
		}

		this.#plugins.push(...plugins);
	}
}
