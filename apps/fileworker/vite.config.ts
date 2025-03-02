import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'sentry',
				project: 'fileworker',
				url: 'https://sentry.uuid.rocks',
			},
		}),
		sveltekit(),
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
