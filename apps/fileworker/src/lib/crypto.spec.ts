import { describe, expect, it, test } from 'vitest'

import { generateToken, hashToken, verifyToken } from './crypto'

describe('hashToken(), verifyToken()', () => {
	test('hash and verify a token', async () => {
		const hash = await hashToken('hello')
		expect(hash.length).toBe(97)
		expect(hash.split(':')[0].length).toBe(32)
		expect(hash.split(':')[1].length).toBe(64)
		expect(await verifyToken(hash, 'hello')).toBe(true)

		// incorrect token does not verify
		expect(await verifyToken(hash, 'world')).toBe(false)
	})
})

describe('generateToken()', () => {
	it('generates a token with default length of 24', async () => {
		const token = await generateToken()
		expect(token.length).toBe(24)
	})

	it('generates a token with specified length', async () => {
		const token = await generateToken(32)
		expect(token.length).toBe(32)
	})
})
