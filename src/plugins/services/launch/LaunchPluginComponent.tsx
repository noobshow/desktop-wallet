import { usePluginManager } from "plugins/context";
import { PluginServiceIdentifier, WithPluginManager } from "plugins/types";
import React from "react";

import { LaunchPluginService } from "./LaunchPluginService";

type Props = {
	pluginId: number;
	fallback?: React.ReactNode;
};

export const LaunchRender = ({ pluginId, fallback, manager }: WithPluginManager<Props>) => {
	const service = manager.services().findById(PluginServiceIdentifier.Launch)?.instance<LaunchPluginService>();

	const result = service?.get(pluginId);

	return <>{result || fallback}</>;
};

export const PluginLaunchRender = (props: Props) => {
	const manager = usePluginManager();
	return <LaunchRender {...props} manager={manager} />;
};
