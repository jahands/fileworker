import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { z } from 'zod'

import * as schema from './schema'
import { files, FileSelect } from './schema'

export type InsertFileResult = z.infer<typeof InsertFileResult>
export const InsertFileResult = z.object({
	file_id: z.string().length(9),
})

export type DeleteFileResult = z.infer<typeof DeleteFileResult>
export const DeleteFileResult = z.object({
	file_id: z.string().length(9),
})

export class DBStore {
	private readonly db

	constructor(d1DB: D1Database) {
		this.db = drizzle(d1DB, { schema })
	}

	async insertFile({
		filename,
		expires_on,
	}: {
		filename: string
		expires_on: Date
	}): Promise<InsertFileResult> {
		const rows = await this.db
			.insert(files)
			.values({
				name: filename,
				expires_on: expires_on.toISOString(),
			})
			.returning({ file_id: files.file_id })

		if (rows.length === 0) {
			throw new Error('failed to insert file')
		}
		return InsertFileResult.parse(rows[0])
	}

	async getFileById(file_id: string): Promise<FileSelect | null> {
		const rows = await this.db.select().from(files).where(eq(files.file_id, file_id))
		if (rows.length === 0) {
			return null
		}
		return FileSelect.parse(rows[0])
	}

	async deleteFileById(file_id: string): Promise<DeleteFileResult | null> {
		const rows = await this.db.delete(files).where(eq(files.file_id, file_id)).returning({
			file_id: files.file_id,
		})
		if (rows.length === 0) {
			return null
		}
		return DeleteFileResult.parse(rows[0])
	}
}
