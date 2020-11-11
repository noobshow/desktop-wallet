import { EventEmitter } from "events";

type HandlerFn = (...args: any[]) => any;

export class PluginHooks extends EventEmitter {
	#handlers: Map<string, HandlerFn[]> = new Map();

	reduce(hookName: string, handler: HandlerFn) {
		const current = this.#handlers.get(hookName) || [];

		if (typeof handler !== "function") {
			throw new Error(`Expected handler to be a function, but found type '${typeof handler}'`);
		}

		current.push(handler);

		this.#handlers.set(hookName, current);
	}

	apply(hookName: string, content: any) {
		if (!this.#handlers.has(hookName)) {
			return;
		}

		const result = this.#handlers.get(hookName)!.reduce((prev, handler) => handler(prev), content);

		this.#handlers.delete(hookName);

		return result;
	}
}
