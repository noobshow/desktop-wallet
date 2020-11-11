import { PluginControllerRepository } from "./plugin-controller-repository";
import { PluginServiceRepository } from "./plugin-service-repository";

export class PluginManager {
	#services: PluginServiceRepository;
	#plugins: PluginControllerRepository;

	constructor() {
		this.#services = new PluginServiceRepository();
		this.#plugins = new PluginControllerRepository(this.#services);
	}

	services() {
		return this.#services;
	}

	plugins() {
		return this.#plugins;
	}
}
