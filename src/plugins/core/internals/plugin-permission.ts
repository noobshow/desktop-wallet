import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginController } from "../plugin-controller";
import { PluginServiceData } from "../plugin-service";

type MiddlewareContext = {
	profile: Profile,
	plugin: PluginController,
	service?: PluginServiceData
}

type Rule = (context: MiddlewareContext) => boolean;

// export const isServiceDefinedInConfig: Rule = ({ service, plugin }) => !!service && plugin.config().permissions?.includes(service.id());
export const isServiceDefinedInConfig: Rule = () => true;
export const isServiceEnabled: Rule = () => true;
export const isPluginEnabled: Rule = ({ profile, plugin }) => profile.plugins().findById(plugin.id()).isEnabled;

export const applyPluginMiddlewares = (context: MiddlewareContext, rules: Rule[]) => (response: any) => {
	const isValid = rules.every(rule => rule(context));

	if (!isValid) {
		throw new Error();
	}

	return response;
}
