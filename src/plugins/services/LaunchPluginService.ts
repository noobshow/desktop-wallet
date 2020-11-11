import { PluginController } from "plugins/core";
import React from "react";

import { PluginService, PluginServiceIdentifier } from "../types";

export class LaunchPluginService implements PluginService {
	#nodes: Record<string, React.ReactNode> = {};

	config() {
		return {
			id: PluginServiceIdentifier.Launch,
			accessor: "launch",
		};
	}

	get(pluginId: string) {
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
