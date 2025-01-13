import pQueue from 'p-queue'
import { withLogTags } from 'workers-tagged-logger'

import { DBStore } from './db/store'
import { logger } from './logger'

import type { Env } from '../app'

export async function handleCron(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
	await withLogTags({ source: 'fileworker' }, async () => {
		logger.info('Deleting old files')
		await deleteExpiredFiles(env)
	})
}

export async function deleteExpiredFiles(env: Env, expiringBefore?: Date) {
	const store = new DBStore(env.DB)

	const expiredFiles = await store.getFilesExpiringBefore(expiringBefore ?? new Date(), 100)
	if (expiredFiles.length === 0) {
		logger.info('no expired files to delete')
		return
	}

	logger.info(`deleting ${expiredFiles.length} files`, { expired_files: expiredFiles })
	// First, delete them from R2
	await env.R2.delete(expiredFiles.map((f) => `files/${f.file_id}`))

	// Next, delete from the DB
	const queue = new pQueue({ concurrency: 6 })
	for (const file of expiredFiles) {
		// TODO: Add bulk delete query
		queue.add(async () => store.deleteFileById(file.file_id))
	}
	await queue.onIdle()
}
