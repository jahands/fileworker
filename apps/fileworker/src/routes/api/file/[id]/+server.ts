import { errorMissingPlatform } from '../../../util'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler<{ id: string; filename?: string }> = ({ request, platform }) => {
	if (!platform) {
		return errorMissingPlatform()
	}
	const { env, cf, ctx } = platform
	return new Response(`Method=${request.method} URL=${request.url}`)
}

export const DELETE: RequestHandler<{ id: string }> = ({ request, platform }) => {
	if (!platform) {
		return errorMissingPlatform()
	}
	const { env, cf, ctx } = platform
	return new Response(`Method=${request.method} URL=${request.url}`)
}
