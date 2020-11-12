import { DataRepository, Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController } from "plugins/core";
import { PluginHooks } from "plugins/core/internals/plugin-hooks";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class StorePluginService implements PluginService {
	#profile: Profile | undefined;
	#stores: Map<number, DataRepository> = new Map();

	config() {
		return {
			id: PluginServiceIdentifier.Store,
			accessor: "store",
		};
	}

	boot(context: { hooks: PluginHooks }) {
		context.hooks.on("profile", (profile) => (this.#profile = profile));
	}

	api(plugin: PluginController) {
		if (!this.#stores.has(plugin.id())) {
			this.create(plugin.id());
		}

		const store = this.#stores.get(plugin.id());

		return {
			data: () => store,
			persist: this.persist.bind(this, plugin.id(), store!),
		};
	}

	private create(pluginId: number) {
		const data = new DataRepository();
		const stored = this.restore(pluginId);

		if (stored) {
			data.fill(stored);
		}

		this.#stores.set(pluginId, data);
	}

	private restore(pluginId: number) {
		return this.#profile?.data().get(`plugin.${pluginId}.store`, {});
	}

	private persist(pluginId: number, data: DataRepository) {
		return this.#profile?.data().set(`plugin.${pluginId}.store`, data.all());
	}
}
