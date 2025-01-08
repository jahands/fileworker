import { env } from 'cloudflare:test'
import { httpStatus } from 'http-codex/status'
import { assert, describe, expect, test } from 'vitest'

import { testSuite } from './suite'

const { it } = testSuite()

describe('PUT /api/file', async () => {
	it('uploads the file to R2', async ({ h }) => {
		const res = await h.client.uploadFile('hello.txt', 'world')
		expect(res.status).toBe(httpStatus.OK)
		assert((await res.text()).endsWith('/hello.txt'))
		const keys = await env.R2.list()
		expect(keys.objects.length).toBe(1)
	})
})

describe('GET /:file_id/:filename?', async () => {
	it('returns 404 for invalid file', async ({ h }) => {
		const res = await h.client.downloadFile('abc', 'file.txt')
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('downloads uploaded file', async ({ h }) => {
		const res = await h.client.uploadFile('hello2.txt', 'world2')
		expect(res.status).toBe(httpStatus.OK)
		const downloadUrl = await res.text()

		// download it
		const res2 = await h.client.fetch(downloadUrl)
		expect(await res2.text()).toBe('world2')
	})
})

describe('GET /:file_id/:filename?', async () => {
	it('returns 404 for invalid file', async ({ h }) => {
		const res = await h.client.deleteFile('abcd')
		expect(res.status).toBe(404)
		expect(await res.text()).toMatchInlineSnapshot(`"404 Not Found"`)
	})

	it('deletes uploaded file', async ({ h }) => {
		const res = await h.client.uploadFile('hello3.txt', 'world3')
		expect(res.status).toBe(httpStatus.OK)
		const downloadUrl = await res.text()

		// download it
		const res2 = await h.client.fetch(downloadUrl)
		expect(await res2.text()).toBe('world3')

		// delete it
		await h.client.deleteFile(getIdFromDownloadUrl(downloadUrl))

		// try to download it -> 404
		const res3 = await h.client.fetch(downloadUrl)
		expect(res3.status).toBe(httpStatus.NotFound)

		// should no longer be in R2
		expect((await env.R2.list()).objects.length).toBe(0)
	})
})

function getIdFromDownloadUrl(url: string): string {
	return url.split('/')[3]
}
