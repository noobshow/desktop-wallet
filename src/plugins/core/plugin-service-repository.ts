import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI, PluginService, PluginServiceIdentifier } from "../types";
import { PluginHooks } from "./internals/plugin-hooks";
import { PluginController } from "./plugin-controller";
import { PluginServiceData } from "./plugin-service";

export class PluginServiceRepository {
	#services: PluginServiceData[] = [];
	#hooks: PluginHooks;

	constructor() {
		this.#hooks = new PluginHooks();
	}

	all() {
		return this.#services;
	}

	hooks() {
		return this.#hooks;
	}

	api(plugin: PluginController, profile: Profile) {
		const result = {};

		for (const service of this.#services) {
			// const guard = withServicePermission(plugin.id(), profile);
			const accessor = service.accessor();
			// @ts-ignore
			result[accessor] = () => service.api(plugin);
		}

		return result as PluginAPI;
	}

	boot() {
		for (const service of this.#services) {
			service.instance().boot?.({
				hooks: this.hooks(),
			});
		}
	}

	register(services: PluginService[]) {
		this.#services.push(...services.map((item) => new PluginServiceData(item)));
	}

	findById(id: PluginServiceIdentifier) {
		return this.#services.find((item) => item.config().id === id);
	}
}
