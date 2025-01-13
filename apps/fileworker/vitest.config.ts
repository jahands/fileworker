import path from 'node:path'
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'

// This config tests the API directly,
// rather than building the full Svelte app
export default defineWorkersConfig(async () => {
	// Read all migrations in the `migrations` directory
	const migrationsPath = path.join(__dirname, 'drizzle')
	const migrations = await readD1Migrations(migrationsPath)

	return {
		test: {
			setupFiles: ['./src/test/integration/apply-migrations.ts'],
			alias: {
				'$lib/api': `${__dirname}/src/lib/api.ts`,
				'$lib/cron': `${__dirname}/src/lib/cron.ts`,
				'$lib/crypto': `${__dirname}/src/lib/crypto.ts`,
				'$lib/db/store': `${__dirname}/src/lib/db/store.ts`,
			},
			poolOptions: {
				workers: {
					main: `${__dirname}/src/test/integration/fixtures/api.ts`,
					wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
					miniflare: {
						bindings: {
							// Add a test-only binding for migrations, so we can apply them in a
							// setup file
							TEST_MIGRATIONS: migrations,
						},
					},
				},
			},
		},
	}
})
