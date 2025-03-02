import { init } from '@jill64/sentry-sveltekit-cloudflare/server'

const { onHandle, onError } = init(
	'https://c3a569f84b96453a241d7bb168ff6cfb@sentry.uuid.rocks/70',
	{
		toucanOptions: {
			tracesSampleRate: 1.0,
		},
	},
)

// Use the onHandle function to create a handle function
export const handle = onHandle()

// Use the onError function to create a handleError function
export const handleError = onError((error, sentryEventId) => {
	console.error('An error occurred:', JSON.stringify(error))
	return {
		message: 'An unexpected error occurred. We have been notified and are working on a fix.',
	}
})
