import { PluginLoaderFileSystem } from "plugins/loader/fs";
import { PluginService } from "plugins/types";
import React, { useCallback, useState } from "react";

import { PluginManager } from "../core";

const PluginManagerContext = React.createContext<any>(undefined);

const useManager = (services: PluginService[]) => {
	const [pluginManager] = useState(() => {
		const manager = new PluginManager();
		manager.services().register(services);
		manager.services().boot();
		return manager;
	});

	const loadPlugins = useCallback(async () => {
		const results = await PluginLoaderFileSystem.ipc().invoke();
		pluginManager.plugins().import(results);
	}, [pluginManager]);

	return { pluginManager, loadPlugins };
};

export const PluginManagerProvider = ({
	children,
	services,
}: {
	children: React.ReactNode;
	services: PluginService[];
}) => {
	const manager = useManager(services);

	return <PluginManagerContext.Provider value={manager}>{children}</PluginManagerContext.Provider>;
};

export const usePluginManagerContext = (): ReturnType<typeof useManager> => React.useContext(PluginManagerContext);
export const usePluginManager = (): PluginManager => React.useContext(PluginManagerContext)?.pluginManager;
