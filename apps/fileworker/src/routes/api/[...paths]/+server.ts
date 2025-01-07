import { router } from '$lib/api'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = ({ request }) => router.fetch(request)
export const DELETE: RequestHandler = ({ request }) => router.fetch(request)
