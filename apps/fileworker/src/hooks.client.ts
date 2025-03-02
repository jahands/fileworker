import { init } from '@jill64/sentry-sveltekit-cloudflare/client'

const onError = init('https://c3a569f84b96453a241d7bb168ff6cfb@sentry.uuid.rocks/70', {
	sentryOptions: {
		tracesSampleRate: 1.0,

		// This sets the sample rate to be 10%. You may want this to be 100% while
		// in development and sample at a lower rate in production
		replaysSessionSampleRate: 0.1,

		// If the entire session is not sampled, use the below sample rate to sample
		// sessions when an error occurs.
		replaysOnErrorSampleRate: 1.0,
	},
})

export const handleError = onError((error, sentryEventId) => {
	console.error('An error occurred:', error)
	return {
		message: 'An unexpected error occurred. We have been notified and are working on a fix.',
	}
})
