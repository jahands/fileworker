import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit'
import * as Sentry from '@sentry/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(
	Sentry.initCloudflareSentryHandle({
		dsn: 'https://c3a569f84b96453a241d7bb168ff6cfb@sentry.uuid.rocks/70',

		tracesSampleRate: 1.0,
	}),
	sentryHandle(),
)

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry()
