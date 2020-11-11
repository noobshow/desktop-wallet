import { PluginController } from "./core/plugin-controller";

export interface PluginAPI {
	launch(): {
		render(children: React.ReactNode): void;
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
}

export interface PluginServiceConfig {
	id: string;
	accessor: string;
}

export interface PluginService {
	config: () => PluginServiceConfig;
	api: (plugin: PluginController) => Record<string, Function>;
	boot?: () => void;
}
