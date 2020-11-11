import { Profile } from "@arkecosystem/platform-sdk-profiles";

export const withPluginPermission = (pluginId: number, profile: Profile) => (param: any) => {
	if (!profile.plugins().findById(pluginId)?.isEnabled) {
		throw new Error("ERR_PLUGIN_NOT_ENABLED");
	}

	return param;
};

export const withServicePermission = (serviceId: string, profile: Profile) => (param: any) => param;
