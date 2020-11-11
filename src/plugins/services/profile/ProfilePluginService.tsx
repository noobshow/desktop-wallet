import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginHooks } from "plugins/core/internals/plugin-hooks";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class ProfilePluginService implements PluginService {
	#profile: Profile | undefined;

	config() {
		return {
			id: PluginServiceIdentifier.Profile,
			accessor: "profile",
		};
	}

	boot({ hooks }: { hooks: PluginHooks }) {
		hooks.on("profile", (profile) => (this.#profile = profile));
	}

	api() {
		return {
			wallets: () =>
				this.#profile
					?.wallets()
					.values()
					.map((wallet) => wallet.toObject()),
		};
	}
}
