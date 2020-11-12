import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI, PluginConfig } from "../types";
import { PluginHooks } from "./internals/plugin-hooks";
import { applyPluginMiddlewares, isPluginEnabled } from "./internals/plugin-permission";
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

	manifest() {
		return this.#config["desktop-wallet"];
	}

	id() {
		return this.#config.id;
	}

	name() {
		return this.#config.name;
	}

	// TODO: Better integration with SDK
	enable(profile: Profile) {
		// @ts-ignore
		profile.plugins().push({ ...this.config(), isEnabled: true });
		this.boot(profile);
	}

	boot(profile: Profile) {
		const pluginAPI = this.#services.api(this, profile);

		const guard = applyPluginMiddlewares({ profile, plugin: this }, [isPluginEnabled]);

		try {
			guard(this.#callback?.(pluginAPI));
			this.#hooks.emit("activated");
		} catch (e) {
			console.error(e);
		}
	}

	dispose() {
		this.#hooks.emit("deactivated");
		// TODO
	}
}
