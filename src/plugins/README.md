## Plugin System

Extends the ARK Desktop Wallet with features that are not built into the core.

```jsx
const MyPlugin = ({ onClick }) => <button onClick={onClick}>Fetch</button>;

export default (api) => {
	const fetchTransactions = async () => {
		const response = await api.http().get("https://dexplorer.ark.io/api/transactions");
		api.store().data().set("transactions", response.body());
	};

	api.events().on("deactivated", () => api.store().persist());
	api.launch().render(<MyPlugin onClick={fetch} />);
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

The Plugin must be authorized by the user before boot, also as show above, the name of the service used must be specified in the metadata. Otherwise it will not be executed.

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
const pluginManager = new PluginManager();

pluginManager.services().register([new StorePluginService()]);
pluginManager.services().boot();

const finder = new PluginLoaderFileSystem([path.resolve("./plugins")]);
const results = await finder.search();

pluginManager.plugins().fill(results);
pluginManager.plugins().boot();

const all = pluginManager.plugins().all();
```

## File System Loader

Simple as it looks, the loader will search for this structure to check for valid plugins.

```
plugins/
├─ my-custom-plugin/
│ ├─ index.js
│ └─ package.json
└─ explorer-plugin/
```

### Custom Entry

It is possible to use another entry file like from `dist/main.js`, just specify it in the `package.json`:

```json
{
	"name": "my-custom-plugin",
	"main": "dist/main.js"
}
```

## Transpilation

The entry file will be executed through a second VM (read more below), so there is no way to automatically transpile your code, if you want to use JSX, Typescript, Babel or others, it must be done in the build process.

[Preconstruct](https://github.com/preconstruct/preconstruct) should be enough for what you want, but there is also [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack).

## Security

We have some "shields" to ensure that the plugin runs only if certain conditions are met, as introduced in the permissions section.

The source code of the entry file will be perfomed by an isolated and secure [sandbox](https://github.com/patriksimek/vm2), to prevent plugins from executing malicious code.

The user can also blacklist the plugin from being displayed or executed in any way.
