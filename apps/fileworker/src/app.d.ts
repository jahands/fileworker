// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env
			cf: CfProperties
			ctx: ExecutionContext
		}
	}
}

export type Env = {
	R2: R2Bucket
}

export type HonoApp = {
	Bindings: Env
	Variables: undefined
}

export {}
