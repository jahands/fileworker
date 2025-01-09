import { generateToken, hashToken, verifyToken } from '$lib/crypto'
import { assert, describe, expect } from 'vitest'

import { testSuite } from './suite'

const { it } = testSuite()

describe('insertFile()', () => {
	it('returns the file_id for the inserted file', async ({ h }) => {
		await h.addRandomFiles()
		const { file_id } = await h.store.insertFile({
			filename: 'hello.txt',
			expires_on: new Date(),
			delete_token_hash: await hashToken(await generateToken()),
		})

		expect(file_id.length).toBe(9)
	})
})

describe('getFileById()', () => {
	it('returns null for non-existent file_id', async ({ h }) => {
		await h.addRandomFiles()
		const file = await h.store.getFileById('nothing')
		expect(file).toBeNull()
	})

	it('returns file associated with the file_id', async ({ h }) => {
		await h.addRandomFiles()
		const expires_on = new Date()
		const delete_token = await generateToken()
		const { file_id } = await h.store.insertFile({
			filename: 'hello.txt',
			expires_on,
			delete_token_hash: await hashToken(delete_token),
		})

		const file = await h.store.getFileById(file_id)
		assert(file !== null)
		expect(file.file_id).toBe(file_id)
		expect(file.name).toBe('hello.txt')
		expect(file.expires_on.getTime()).toBe(expires_on.getTime())
		expect(file.file_pk).toBeGreaterThan(0)
		expect(await verifyToken(file.delete_token_hash, delete_token)).toBe(true)
	})
})

describe('getFilesExpiringBefore()', () => {
	it('gets files expiring before specified date', async ({ h }) => {
		// insert some files
		const [file1, file2, file3] = await Promise.all([
			h.store.insertFile({
				filename: 'hello1.txt',
				expires_on: new Date('2022-01-03'),
				delete_token_hash: await hashToken(await generateToken()),
			}),
			h.store.insertFile({
				filename: 'hello2.txt',
				expires_on: new Date('2023-01-03'),
				delete_token_hash: await hashToken(await generateToken()),
			}),
			h.store.insertFile({
				filename: 'hello3.txt',
				expires_on: new Date('2024-01-03'),
				delete_token_hash: await hashToken(await generateToken()),
			}),
		])

		const expiredFiles = await h.store.getFilesExpiringBefore(new Date('2023-01-04'))
		expect(expiredFiles.length === 2)
		const expiredFileIDs = expiredFiles.map((f) => f.file_id)
		expect(expiredFileIDs).includes(file1.file_id)
		expect(expiredFileIDs).includes(file2.file_id)
		expect(expiredFileIDs).not.includes(file3.file_id)
	})
})

describe('deleteFileById()', () => {
	it('deletes the specified file from the DB', async ({ h }) => {
		const existingFiles = await h.addRandomFiles()
		const { file_id } = await h.store.insertFile({
			filename: 'hello.txt',
			expires_on: new Date(),
			delete_token_hash: await hashToken(await generateToken()),
		})

		// make sure we can get it
		const file = await h.store.getFileById(file_id)
		assert(file !== null)

		// delete it
		await h.store.deleteFileById(file_id)
		// ensure it no longer exists
		const file2 = await h.store.getFileById(file_id)
		assert(file2 === null)

		// other files should still exist
		const files = await Promise.all(existingFiles.map((f) => h.store.getFileById(f.file_id)))
		expect(files.length).toBe(3)
		assert(files.every((f) => f !== null))
	})
})
