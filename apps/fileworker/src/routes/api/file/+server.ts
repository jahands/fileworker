import { errorMissingPlatform } from '../../util'

import type { RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = ({ request, platform }) => {
	if (!platform) {
		return errorMissingPlatform()
	}
	const { env, cf, ctx } = platform
	return new Response(`Method=${request.method} URL=${request.url}`)
}
