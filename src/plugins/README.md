## Plugin System

Extends the ARK Desktop Wallet with features that are not built into the core.

```js
const MyPlugin = ({ fetchTransactions }) =>
	React.createElement(
		"button",
		{
			onClick: () => fetchTransactions(),
		},
		"Fetch",
	);

module.exports = (api) => {
	const fetchTransactions = async () => {
		const response = await api.http().get("https://dexplorer.ark.io/api/transactions");
		api.store().data().set("transactions", response.body());
	};

	api.events().on("deactivated", () => api.store().persist());
	api.launch().render(MyPlugin({ fetchTransactions }));
};
```

The process can now render it with:

```tsx
<App>
	<PluginLaunchRender pluginId="my-plugin" fallback={<h1>Plugin Not Loaded</h1>}>
</App>
```

### API

The Plugin API provides methods for the plugin to interact with registered services.

### Metadata

Some properties must be defined in the `package.json` so that the user knows what is being used by the plugin.

```json
{
	"permissions": ["HTTP", "STORE", "LAUNCH", "EVENTS"],
	"urls": ["https://dexplorer.ark.io"]
}
```

### Permissions

The Plugin must be authorized by the current profile before boot, also as show below, the name of the service used must be specified in the metadata. Otherwise it will not be executed.

### Services

The Plugin Services make the communication between the plugin and the process, providing its own API for the plugin, and all related logic as components or functions to be implemented in the process if necessary.

## Usage

### React

```tsx
const services = [new StorePluginService()];

const Page = () => {
	const activeProfile = useActiveProfile();
	const { loadPlugins, pluginManager } = usePluginManagerContext();

	return (
		<section>
			<button onClick={loadPlugins}>Load</button>
			<ul>
				{pluginManager.plugins().all().map(plugin => (
					<li key={plugin.id()}>
						<span>{plugin.name()}</span>
						<button onClick={() => plugin.boot(activeProfile)}>
							Enable
						</button>
					</li>
				))}
			</ul>
		</section>
	)
}

const App = () => (
	<EnvironmentProvider>
		<PluginManagerProvider services={services}>
			<Page />
		</PluginManagerProvider>
	</EnvinromentProvider>
)
```

### Standalone

```ts
const services = [new StorePluginService()];
const pluginManager = new PluginManager();

pluginManager.services().register(services);
pluginManager.services().boot();

const finder = new PluginLoaderFileSystem([path.resolve("./my-plugins")]);
const results = await finder.search();

pluginManager.plugins().import(results);
pluginManager.plugins().boot();

const all = pluginManager.plugins().all();
```
