import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginController } from "../plugin-controller";
import { PluginServiceData } from "../plugin-service";

type MiddlewareContext = {
	profile: Profile;
	plugin: PluginController;
	service?: PluginServiceData;
};

type Rule<T = any> = (context: MiddlewareContext) => (result: T) => T | never;

export const isServiceDefinedInConfig: Rule = ({ service, plugin }) => (result) => {
	if (!!service && plugin.manifest().permissions?.includes(service.id())) {
		return result;
	}
	console.log("af");
	return console.error.bind(console, `The plugin ${plugin.name()} did not defined ${service?.id()} in permissions.`);
};

// TODO:
export const isServiceEnabled: Rule = () => (result) => result;

export const isPluginEnabled: Rule = ({ profile, plugin }) => (result) => {
	if (profile.plugins().findById(plugin.id()).isEnabled) {
		return result;
	}
	throw new Error("ERR_PLUGIN_NOT_ENABLED");
};

export const applyPluginMiddlewares = (context: MiddlewareContext, rules: Rule[]) => (response: any) =>
	rules.reduce((acc, rule) => rule(context)(acc), response);
