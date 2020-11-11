import { PluginAPI, PluginService, PluginServiceIdentifier } from "../types";
import { PluginController } from "./plugin-controller";
import { PluginServiceData } from "./plugin-service";

export class PluginServiceRepository {
	#services: PluginServiceData[] = [];

	all() {
		return this.#services;
	}

	api(plugin: PluginController) {
		const result = {};

		for (const service of this.#services) {
			// const guard = withPluginPermission(plugin.id(), this.#env);
			const accessor = service.accessor();
			// @ts-ignore
			result[accessor] = () => service.api(plugin);
		}

		return result as PluginAPI;
	}

	boot() {
		for (const service of this.#services) {
			service.instance().boot?.();
		}
	}

	register(services: PluginService[]) {
		this.#services.push(...services.map((item) => new PluginServiceData(item)));
	}

	findById(id: PluginServiceIdentifier) {
		return this.#services.find((item) => item.config().id === id);
	}
}
