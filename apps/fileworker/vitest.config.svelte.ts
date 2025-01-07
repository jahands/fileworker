import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
	test: {
		globalSetup: [`${__dirname}/src/test/global-setup.ts`],
		// TODO: May want to test some stuff through the whole Svelte
		// app later, but skipping for now because it requires building
		// the whole Worker on every run.
		include: [`${__dirname}/src/demo.spec.ts`],
		poolOptions: {
			workers: {
				wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
			},
		},
	},
})
