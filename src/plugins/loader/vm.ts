import { NodeVM } from "vm2";

export const runUnknownCode = (code: string, path: string) =>
	new NodeVM({
		require: {
			external: true,
		},
	}).run(code, path);
