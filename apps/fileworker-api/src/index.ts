import { Hono } from 'hono'

import {
	getTracingConfig,
	useAxiomLogger,
	useMeta,
	useNotFound,
	useOnError,
	useSentry,
} from '@repo/hono-helpers'
import { instrument } from '@repo/otel'

import { initSentry } from './helpers/sentry'

import type { App, Bindings } from './types'

const app = new Hono<App>()
	.use(
		'*', // Middleware
		useMeta,
		useSentry(initSentry, 'http.server'),
		useAxiomLogger,
	)

	// Hooks
	.onError(useOnError())
	.notFound(useNotFound())

const handler = {
	fetch: app.fetch,
} satisfies ExportedHandler<Bindings>

export default instrument(handler, getTracingConfig<App>())
