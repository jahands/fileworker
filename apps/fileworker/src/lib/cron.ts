import { DBStore } from './db/store'
import { logger } from './logger'

import type { Env } from '../app'

export async function handleCron(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
	logger.info('Cleaning DB store...')
	const store = new DBStore(env.DB)
	logger.info(store)
	// TODO
}
