import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";
import React from "react";

export class LaunchPluginService implements PluginService {
	#nodes: Record<string, React.ReactNode> = {};

	config() {
		return {
			id: PluginServiceIdentifier.Launch,
			accessor: "launch",
		};
	}

	get(pluginId: number) {
		return this.#nodes[pluginId];
	}

	api(plugin: PluginController) {
		return {
			render: this.render.bind(this, plugin.id()),
		};
	}

	private render(pluginId: number, children: React.ReactNode) {
		this.#nodes[pluginId] = children;
	}
}
