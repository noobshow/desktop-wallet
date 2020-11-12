import { httpClient } from "app/services";
import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class HttpPluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.HTTP,
			accessor: "http",
		};
	}

	api(plugin: PluginController) {
		return {
			get: this.send.bind(undefined, "get", plugin),
			post: this.send.bind(undefined, "post", plugin),
		};
	}

	private send(type: "get" | "post", plugin: PluginController, url: string, ...args: any) {
		const isValid = plugin.manifest().urls?.some((uri) => new RegExp(uri).test(url));

		if (!isValid) {
			throw new Error("ERR_HTTP_SERVICE_INVALID");
		}

		return httpClient[type](url, ...args);
	}
}
