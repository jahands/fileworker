import { UploadFileResponse } from '$lib/api'
import { deleteExpiredFiles } from '$lib/cron'
import { generateToken, hashToken, verifyToken } from '$lib/crypto'
import { env } from 'cloudflare:test'
import { assert, describe, expect } from 'vitest'

import { testSuite } from './suite'

const { it } = testSuite()

describe('deleteExpiredFiles()', () => {
	it('deletes expired files from R2 and D1', async ({ h }) => {
		// insert some files
		const [file1, file2, file3] = await Promise.all(
			(
				await Promise.all([
					h.client.uploadFile('hello1.txt', 'world1', 300),
					h.client.uploadFile('hello2.txt', 'world2', 600),
					h.client.uploadFile('hello3.txt', 'world3', 900),
				])
			).map(async (r) => UploadFileResponse.parse(await r.json())),
		)

		// get expire date between 2nd and 3rd file
		const expireBefore = new Date(new Date().getTime() + 700 * 1000)

		// Make sure they are in the DB
		const files = await h.store.getFilesExpiringBefore(expireBefore)
		expect(files.length).toBe(2)

		// and in R2
		const r2Res = await Promise.all([
			env.R2.head(`files/${file1.file_id}`),
			env.R2.head(`files/${file2.file_id}`),
		])
		expect(r2Res.length).toBe(2)
		expect(r2Res.every((f) => f !== null)).toBe(true)

		// Delete expired files
		await deleteExpiredFiles(env, expireBefore)

		// should be one remaining file in DB and R2

		const files2 = await h.store.getFilesExpiringBefore(new Date('2099-01-03'))
		expect(files2.length).toBe(1)
		expect(files2[0].file_id).toBe(file3.file_id)

		const r2Res2 = await env.R2.list()
		expect(r2Res2.objects.length).toBe(1)
		expect(r2Res2.objects[0].key).toBe(`files/${file3.file_id}`)
	})
})
