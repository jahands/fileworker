import { DBStore } from './db/store'

import type { Env } from '../app'

export async function handleCron(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
	console.log('Cleaning DB store...')
	const store = new DBStore(env.DB)
	console.log(store)
	// TODO
}
