import { Contracts } from "@arkecosystem/platform-sdk";
import { DataRepository, RegistryPluginManifest } from "@arkecosystem/platform-sdk-profiles";

import { PluginManager } from "./core";
import { PluginHooks } from "./core/internals/plugin-hooks";
import { PluginController } from "./core/plugin-controller";

export type WithPluginManager<T> = T & { manager: PluginManager };

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
	store(): {
		data: () => DataRepository;
		persist: () => void;
	};
}

export interface PluginConfig {
	id: number;
	name: string;
	version: string;
	"desktop-wallet": RegistryPluginManifest;
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
	Store = "STORE",
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
