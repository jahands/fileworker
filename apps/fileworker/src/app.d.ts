// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import { DBStore } from '$lib/db/store'

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
	DB: D1Database

	/** Only used in tests */
	TEST_MIGRATIONS: D1Migration[]
}

export type HonoApp = {
	Bindings: Env
	Variables: {
		store: DBStore
	}
}

export {}
