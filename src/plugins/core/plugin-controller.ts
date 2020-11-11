import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI, PluginConfig } from "../types";
import { withPluginPermission } from "./plugin-permission";
import { PluginServiceRepository } from "./plugin-service-repository";

type Callback = (api: PluginAPI) => void;

export class PluginController {
	#config: PluginConfig;
	#callback: Callback;
	#services: PluginServiceRepository;

	constructor(config: PluginConfig, callback: Callback, serviceRespository: PluginServiceRepository) {
		this.#services = serviceRespository;
		this.#config = config;
		this.#callback = callback;
	}

	id() {
		return this.#config.id;
	}

	boot(profile: Profile) {
		const pluginAPI = this.#services.api(this);

		const guard = withPluginPermission(this.id(), profile);

		const result = guard(this.#callback?.(pluginAPI));

		return result;
	}

	dispose() {
		// TODO
	}
}
