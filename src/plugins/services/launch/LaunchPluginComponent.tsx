import { usePluginManager } from "plugins/context";
import { PluginServiceIdentifier } from "plugins/types";
import React from "react";

import { LaunchPluginService } from "./LaunchPluginService";

type Props = {
	pluginId: number;
	fallback?: React.ReactNode;
};

export const PluginLaunchRender = ({ pluginId, fallback }: Props) => {
	const manager = usePluginManager();
	const service = manager.services().findById(PluginServiceIdentifier.Launch)?.instance<LaunchPluginService>();

	const result = service?.get(pluginId);

	return <>{result || fallback}</>;
};
