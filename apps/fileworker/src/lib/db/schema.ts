import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

export const files = sqliteTable('files', {
	file_pk: int().primaryKey({ autoIncrement: true }),
	file_id: text()
		.notNull()
		.unique() // in case of very rare collisions
		.$defaultFn(() => createId()),
	name: text().notNull(),
	created_on: text()
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	expires_on: text().notNull(),
	delete_token_hash: text().notNull(),
})

// Zod schemas for the table. Docs: https://orm.drizzle.team/docs/zod

export type FileSelect = z.infer<typeof FileSelect>
export const FileSelect = createSelectSchema(files, {
	created_on: (d) => d.pipe(z.coerce.date()),
	expires_on: (d) => d.pipe(z.coerce.date()),
})

export type FileInsert = z.infer<typeof FileInsert>
export const FileInsert = createInsertSchema(files)

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
function createId(): string {
	return nanoid(9)
}
