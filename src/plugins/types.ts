import { Contracts } from "@arkecosystem/platform-sdk";

import { PluginHooks } from "./core/internals/plugin-hooks";
import { PluginController } from "./core/plugin-controller";

export interface PluginAPI {
	launch(): {
		render(children: React.ReactNode): void;
	};
	http(): {
		get: (url: string, query?: object) => Promise<Contracts.HttpResponse>;
		post: (url: string, data?: object) => Promise<Contracts.HttpResponse>;
	};
	events(): {
		on: (channel: string) => void;
	};
	profile(): {
		wallets: () => Record<string, any>[];
	};
}

// TODO: Export from SDK
export interface PluginConfig {
	id: number;
	name: string;
	version: string;
}

export interface PluginRawInstance {
	config: PluginConfig;
	path: string;
	source: string;
}

export enum PluginServiceIdentifier {
	Launch = "LAUNCH",
	HTTP = "HTTP",
	Events = "EVENTS",
	Profile = "PROFILE",
}

export interface PluginServiceConfig {
	id: string;
	accessor: string;
}

export interface PluginService {
	config: () => PluginServiceConfig;
	api: (plugin: PluginController) => Record<string, Function>;
	boot?: (context: { hooks: PluginHooks }) => void;
}
