import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

// This config tests the API directly,
// rather than building the full Svelte app
export default defineWorkersConfig({
	test: {
		alias: {
			'$lib/api': `${__dirname}/src/lib/api.ts`,
		},
		poolOptions: {
			workers: {
				main: `${__dirname}/src/test/integration/fixtures/api.ts`,
				wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
			},
		},
	},
})
