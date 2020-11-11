import { useEnvironmentContext } from "app/contexts";
import { usePluginManager } from "plugins/context";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const PluginRouterWrapper = ({ children }: { children: React.ReactNode }) => {
	const context = useEnvironmentContext();
	const { profileId } = useParams();
	const pluginManager = usePluginManager();

	const hasProfile = context.env.profiles().has(profileId);
	const profile = hasProfile && context.env.profiles().findById(profileId);

	useEffect(() => {
		if (profile) {
			pluginManager.plugins().boot(profile);
		}
	}, [pluginManager, profile]);

	return <>{children}</>;
};
