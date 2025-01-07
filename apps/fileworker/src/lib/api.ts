import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { errorMissingPlatform } from '../routes/util'

import type { RequestHandler } from '@sveltejs/kit'
import type { HonoApp } from '../app'

export type GetFileParams = z.infer<typeof GetFileParams>
export const GetFileParams = z.object({
	file_id: z.string(),
	filename: z.string(),
})

export const routeHandler: RequestHandler = ({ request, platform }) => {
	if (!platform) {
		return errorMissingPlatform()
	}
	return router.fetch(request, platform.env, platform.ctx)
}

export type Router = typeof router
export const router = new Hono<HonoApp>()

	.get(
		'/api/file/:file_id/:filename?',
		zValidator(
			'param',
			z.object({
				file_id: z.string(),
				filename: z.string().optional(),
			}),
		),
		async (c) => {
			return c.text(`Method=${c.req.method} URL=${c.req.url} Route=${c.req.routePath}`)
		},
	)

	.delete(
		'/api/file/:file_id',
		zValidator(
			'param',
			z.object({
				file_id: z.string(),
			}),
		),
		async (c) => {
			return c.text(`Method=${c.req.method} URL=${c.req.url} Route=${c.req.routePath}`)
		},
	)

	.get(
		'/:file_id/:filename',
		zValidator(
			'param',
			z.object({
				file_id: z.string(),
				filename: z.string(),
			}),
		),
		async (c) => {
			return c.text(`Method=${c.req.method} URL=${c.req.url} Route=${c.req.routePath}`)
		},
	)
