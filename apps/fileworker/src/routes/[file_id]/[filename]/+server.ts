import { routeHandler } from '$lib/api'

import type { RequestHandler } from '@sveltejs/kit'

/**
 * GET is an alias for GET /api/file/:file_id/:filename.
 */
export const GET: RequestHandler = routeHandler
