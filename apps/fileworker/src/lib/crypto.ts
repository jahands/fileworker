// Modified from https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html

export async function hashToken(token: string, providedSalt?: Uint8Array): Promise<string> {
	const encoder = new TextEncoder()
	// Use provided salt if available, otherwise generate a new one
	const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16))
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(token),
		{ name: 'PBKDF2' },
		false,
		['deriveBits', 'deriveKey'],
	)

	const key = await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100_000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt'],
	)

	const exportedKey = await crypto.subtle.exportKey('raw', key)
	const hashBuffer = new Uint8Array(exportedKey)
	const hashArray = Array.from(hashBuffer)
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
	return `${saltHex}:${hashHex}`
}

export async function verifyToken(storedHash: string, tokenAttempt: string): Promise<boolean> {
	const [saltHex, originalHash] = storedHash.split(':')
	const matchResult = saltHex.match(/.{1,2}/g)
	if (!matchResult) {
		throw new Error('Invalid salt format')
	}
	const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)))
	const attemptHashWithSalt = await hashToken(tokenAttempt, salt)
	const [, attemptHash] = attemptHashWithSalt.split(':')
	return attemptHash === originalHash
}

const tokenCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
export async function generateToken(length = 24): Promise<string> {
	const array = new Uint32Array(length)

	const rb = crypto.getRandomValues(array)
	let r = ''
	for (let i = 0; i < rb.length; i++) {
		const j = rb[i] % tokenCharset.length
		r = r + tokenCharset[j]
	}
	return r
}
