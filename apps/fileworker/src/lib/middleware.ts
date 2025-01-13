import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

import { logger } from './logger'
import { initSentry } from './sentry'

import type { Context, Next } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { HonoApp } from '../app'

/**
 * Adds sentry when the DSN is set
 * Typically, this should be added early in the middleware chain
 */
export async function useSentry(c: Context<HonoApp>, next: Next): Promise<void> {
	const dsn = c.env.SENTRY_DSN
	if (dsn) {
		const release = c.env.SENTRY_RELEASE ?? 'unknown'

		const sentry = initSentry({
			request: c.req.raw,
			ctx: c.executionCtx,
			dsn,
			release,
		})

		c.set('sentry', sentry)
	}

	await next()
}

export function useOnError(err: Error, c: Context<HonoApp>): Response {
	logger.error(err)

	if (err instanceof HTTPException) {
		const status = err.getResponse().status
		const body: APIError = { success: false, error: { message: err.message } }
		if (status >= 500 && status <= 599) {
			// Log 5XX errors to Sentry
			c.var.sentry?.withScope(async (scope) => {
				scope.setContext('HTTP Exception', {
					status: status,
					body,
				})
				c.var.sentry?.captureException(err)
			})
		}

		return c.json(body, status as ContentfulStatusCode)
	}

	// Log all other error types to Sentry
	c.var.sentry?.captureException(err)

	return c.json(
		{
			success: false,
			error: { message: 'internal server error' },
		} satisfies APIError,
		500,
	)
}

export type APIError = z.infer<typeof APIError>
export const APIError = z.object({
	success: z.boolean(),
	error: z.object({
		message: z.string(),
	}),
})
