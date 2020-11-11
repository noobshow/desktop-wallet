import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { runUntrustedCode } from "plugins/loader";

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

	boot(profile: Profile) {
		for (const ctrl of this.#plugins) {
			ctrl.boot(profile);
		}
	}

	import(instances: PluginRawInstance[]) {
		const plugins: PluginController[] = [];

		for (const entry of instances) {
			const callback = runUntrustedCode(entry.source, entry.path);
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
