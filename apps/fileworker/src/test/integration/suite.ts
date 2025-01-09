import { DBStore } from '$lib/db/store'
import { env } from 'cloudflare:test'
import { test } from 'vitest'
import { z } from 'zod'

import { TestClient } from './client'

export function testSuite(): TestSuite {
	return new TestSuite()
}

class TestSuite {
	get test() {
		return test.extend<{ h: TestHarness }>({
			h: async ({ task: _task }, use) => {
				await use(new TestHarness(this))

				// cleanup
				while (true) {
					const keys = await env.R2.list()
					if (keys.objects.length === 0) {
						break
					}
					await env.R2.delete(keys.objects.map((o) => o.key))
				}
			},
		})
	}

	get it() {
		return this.test
	}
}

class TestHarness {
	readonly client: TestClient
	readonly store: DBStore

	constructor(readonly suite: TestSuite) {
		this.client = new TestClient()
		this.store = new DBStore(env.DB)
	}
}

/** Converts test name to string safe to use in filepath */
export function formatTestName(name: string): string {
	return z
		.string()
		.toLowerCase()
		.transform((s) =>
			s
				.replace(/[\W_]+/g, '_')
				.replace(/^_+/, '')
				.replace(/_+$/, '')
				.slice(0, 64),
		)
		.pipe(z.string().regex(/^\w{1,64}$/, { message: 'must be 1 to 64 characters' }))
		.parse(name)
}
