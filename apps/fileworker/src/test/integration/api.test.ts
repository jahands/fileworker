import { SearchFileResponse, UploadFileResponse } from '$lib/api'
import { generateToken } from '$lib/crypto'
import { env } from 'cloudflare:test'
import { httpStatus } from 'http-codex/status'
import { datePlus } from 'itty-time'
import { assert, describe, expect } from 'vitest'

import { testSuite } from './suite'

const { it } = testSuite()

describe('PUT /api/file', async () => {
	it('uploads the file to R2 and writes to DB', async ({ h }) => {
		const res = await h.client.uploadFile('hello.txt', 'world')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id, filename } = UploadFileResponse.parse(await res.json())
		expect(filename).toBe('hello.txt')
		const keys = await env.R2.list()
		expect(keys.objects.length).toBe(1)

		const dbFile = await h.store.getFileById(file_id)
		assert(dbFile !== null)
		expect(dbFile.file_id).toBe(file_id)
	})

	it('defaults to 1 day expiration', async ({ h }) => {
		const minExpectedExpiresAfter = datePlus('86400 seconds').getTime()
		const maxExpectedExpiresAfter = datePlus('86460 seconds').getTime()

		const res = await h.client.uploadFile('hello.txt', 'world')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id, filename } = UploadFileResponse.parse(await res.json())
		expect(filename).toBe('hello.txt')
		const keys = await env.R2.list()
		expect(keys.objects.length).toBe(1)

		const dbFile = await h.store.getFileById(file_id)
		assert(dbFile !== null)
		expect(dbFile.file_id).toBe(file_id)

		const expiresOnSeconds = dbFile.expires_on.getTime()
		expect(expiresOnSeconds).toBeGreaterThanOrEqual(minExpectedExpiresAfter)
		expect(expiresOnSeconds).toBeLessThanOrEqual(maxExpectedExpiresAfter)
	})

	it('allows setting custom expiration', async ({ h }) => {
		const minExpectedExpiresAfter = datePlus('7000 seconds').getTime()
		const maxExpectedExpiresAfter = datePlus('7060 seconds').getTime()

		const res = await h.client.uploadFile('hello.txt', 'world', 7000)
		expect(res.status).toBe(httpStatus.OK)
		const { file_id, filename } = UploadFileResponse.parse(await res.json())
		expect(filename).toBe('hello.txt')
		const keys = await env.R2.list()
		expect(keys.objects.length).toBe(1)

		const dbFile = await h.store.getFileById(file_id)
		assert(dbFile !== null)
		expect(dbFile.file_id).toBe(file_id)

		const expiresOnSeconds = dbFile.expires_on.getTime()
		expect(expiresOnSeconds).toBeGreaterThanOrEqual(minExpectedExpiresAfter)
		expect(expiresOnSeconds).toBeLessThanOrEqual(maxExpectedExpiresAfter)
	})
})

describe('GET /:file_id/:filename', async () => {
	it('returns 404 for invalid file', async ({ h }) => {
		const res = await h.client.downloadFile('abc', 'file.txt')
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('downloads uploaded file', async ({ h }) => {
		const res = await h.client.uploadFile('hello2.txt', 'world2')
		expect(res.status).toBe(httpStatus.OK)

		const { file_id, filename } = UploadFileResponse.parse(await res.json())

		// download it
		const res2 = await h.client.downloadFile(file_id, filename)
		expect(await res2.text()).toBe('world2')
	})
})

describe('GET /api/file/:file_id/:filename', async () => {
	it('returns 404 for invalid file', async ({ h }) => {
		const res = await h.client.downloadFileAPI('abc', 'file.txt')
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('downloads uploaded file', async ({ h }) => {
		const res = await h.client.uploadFile('hello3.txt', 'world3')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id, filename } = UploadFileResponse.parse(await res.json())

		// download it
		const res2 = await h.client.downloadFile(file_id, filename)
		expect(await res2.text()).toBe('world3')
	})
})

describe('GET /api/file/search/:file_id', async () => {
	it('returns 404 for invalid file id', async ({ h }) => {
		const res = await h.client.searchFile('abc')
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('returns filename for existing file', async ({ h }) => {
		const res = await h.client.uploadFile('hello4.txt', 'world4')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id } = UploadFileResponse.parse(await res.json())

		// search for the file
		const res2 = await h.client.searchFile(file_id)
		expect(res2.status).toBe(httpStatus.OK)
		const body = await res2.json()
		const { filename } = SearchFileResponse.parse(body)
		expect(filename).toBe('hello4.txt')
	})
})

describe('DELETE /api/file/:file_id', async () => {
	it('returns 404 for invalid file', async ({ h }) => {
		const res = await h.client.deleteFile('abcd', await generateToken())
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('returns 403 for incorrect delete_token', async ({ h }) => {
		const res = await h.client.uploadFile('hello6.txt', 'world6')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id } = UploadFileResponse.parse(await res.json())

		const res2 = await h.client.deleteFile(file_id, await generateToken())
		expect(res2.status).toBe(httpStatus.Forbidden)
		expect(await res2.text()).toMatchInlineSnapshot(`"Forbidden"`)
	})

	it('deletes uploaded file from R2 and DB', async ({ h }) => {
		const res = await h.client.uploadFile('hello5.txt', 'world5')
		expect(res.status).toBe(httpStatus.OK)
		const { file_id, filename, delete_token } = UploadFileResponse.parse(await res.json())

		// download it
		const res2 = await h.client.downloadFile(file_id, filename)
		expect(await res2.text()).toBe('world5')

		// delete it
		await h.client.deleteFile(file_id, delete_token)

		// try to download it -> 404
		const res3 = await h.client.downloadFile(file_id, filename)
		expect(res3.status).toBe(httpStatus.NotFound)

		// should no longer be in R2
		expect((await env.R2.list()).objects.length).toBe(0)
	})
})
