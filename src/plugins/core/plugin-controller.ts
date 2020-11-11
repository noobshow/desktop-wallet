import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI, PluginConfig } from "../types";
import { PluginHooks } from "./internals/plugin-hooks";
import { withPluginPermission } from "./internals/plugin-permission";
import { PluginServiceRepository } from "./plugin-service-repository";

type Callback = (api: PluginAPI) => void;

export class PluginController {
	#config: PluginConfig;
	#callback: Callback;
	#services: PluginServiceRepository;
	#hooks: PluginHooks;

	constructor(config: PluginConfig, callback: Callback, serviceRespository: PluginServiceRepository) {
		this.#services = serviceRespository;
		this.#config = config;
		this.#callback = callback;
		this.#hooks = new PluginHooks();
	}

	hooks() {
		return this.#hooks;
	}

	config() {
		return this.#config;
	}

	id() {
		return this.#config.id;
	}

	boot(profile: Profile) {
		const pluginAPI = this.#services.api(this, profile);

		const guard = withPluginPermission(this.id(), profile);

		const result = guard(this.#callback?.(pluginAPI));

		this.#hooks.emit("activated");

		return result;
	}

	dispose() {
		this.#hooks.emit("deactivated");
		// TODO
	}
}
