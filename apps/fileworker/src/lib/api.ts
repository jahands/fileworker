import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { Env } from 'hono'

export type GetFileParams = z.infer<typeof GetFileParams>
export const GetFileParams = z.object({
	file_id: z.string(),
	filename: z.string(),
})

export type Router = typeof router
export const router = new Hono<Env>()

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
