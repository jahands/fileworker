import { WorkersLogger } from 'workers-tagged-logger'

/** Type hints for log tags */
export type LoggerTags = {
	release: string
	file_id: string
}

export const logger = new WorkersLogger<LoggerTags>()
