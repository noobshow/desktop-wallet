import React from "react";

import { usePluginManager } from "../context";
import { PluginServiceIdentifier } from "../types";
import { LaunchPluginService } from "./LaunchPluginService";

type Props = {
	pluginId: string;
	fallback?: React.ReactNode;
};

export const PluginLaunchRender = ({ pluginId, fallback }: Props) => {
	const manager = usePluginManager();
	const service = manager.services().findById(PluginServiceIdentifier.Launch)?.instance<LaunchPluginService>();

	const result = service?.get(pluginId);

	return <>{result || fallback}</>;
};
