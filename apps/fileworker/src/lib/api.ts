import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { httpStatus } from 'http-codex/status'
import { z } from 'zod'

import { errorMissingPlatform } from '../routes/util'

import type { RequestHandler } from '@sveltejs/kit'
import type { Context } from 'hono'
import type { HonoApp } from '../app'

export type GetFileParams = z.infer<typeof GetFileParams>
export const GetFileParams = z.object({
	file_id: z.string(),
	filename: z.string(),
})

export type SearchFileResponse = z.infer<typeof SearchFileResponse>
export const SearchFileResponse = z.object({
	filename: z.string().min(1),
})

/** Custom metadata for files in R2 */
export type R2FileMetadata = z.infer<typeof R2FileMetadata>
export const R2FileMetadata = z.object({
	filename: z.string().min(1),
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
		'/api/file/search/:file_id?',
		zValidator(
			'param',
			z.object({
				file_id: z.string(),
			}),
		),
		async (c) => {
			const { file_id } = c.req.valid('param')
			const res = await c.env.R2.head(`files/${file_id}`)
			if (!res) {
				return c.notFound()
			}
			const { filename } = R2FileMetadata.parse(res.customMetadata)
			return c.json({ filename })
		},
	)

	.put(
		'/api/file/:filename',
		zValidator(
			'param',
			z.object({
				filename: z.string(),
			}),
		),
		async (c) => {
			const { filename } = c.req.valid('param')
			const file = await c.req.blob()
			// todo: use a shorter ID and record to DB
			const id = crypto.randomUUID()
			await c.env.R2.put(`files/${id}`, file, {
				customMetadata: R2FileMetadata.parse({
					filename,
				} satisfies R2FileMetadata),
			})
			return c.json({ fileIdentifier: id, fileName: filename })
		},
	)

	.get(
		'/api/file/:file_id/:filename',
		zValidator(
			'param',
			z.object({
				file_id: z.string(),
				filename: z.string(),
			}),
		),
		async (c) => {
			const { file_id, filename } = c.req.valid('param')
			return await downloadFile(c, file_id, filename)
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
			const { file_id, filename } = c.req.valid('param')
			return await downloadFile(c, file_id, filename)
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
			const { file_id } = c.req.valid('param')
			const meta = await c.env.R2.head(`files/${file_id}`)
			if (!meta) {
				return c.notFound()
			}
			await c.env.R2.delete(`files/${file_id}`)
			return c.body(null, httpStatus.NoContent)
		},
	)

async function downloadFile(c: Context<HonoApp>, file_id: string, filename: string) {
	const res = await c.env.R2.get(`files/${file_id}`)
	if (!res) {
		return c.notFound()
	}

	return c.body(res.body, 200, {
		// todo: content-type/content-length
		// todo: maybe make images inline instead of attachment
		'Content-Disposition': `attachment; filename="${filename}"`,
	})
}
