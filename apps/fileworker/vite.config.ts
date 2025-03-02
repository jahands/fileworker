import { config } from '@dotenvx/dotenvx'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

// Load environment variables from .env.sentry-build-plugin
const env = config({ path: '.env.sentry-build-plugin' })

export default defineConfig({
	build: {
		sourcemap: true,
	},
	plugins: [
		sentryVitePlugin({
			org: 'sentry',
			project: 'fileworker',
			url: 'https://sentry.uuid.rocks',
			authToken: env.parsed?.SENTRY_AUTH_TOKEN,
		}),
		sveltekit(),
	],

	ssr: {
		noExternal: ['@jill64/sentry-sveltekit-cloudflare'],
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
