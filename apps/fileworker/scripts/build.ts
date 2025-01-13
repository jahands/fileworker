import 'zx/globals'

import { fileURLToPath } from 'url'
import * as esbuild from 'esbuild'

const baseDir = path.resolve(path.basename(fileURLToPath(import.meta.url)), '..')

// Build the main app with Vite (which uses the SvelteKit plugin)
await $({
	env: process.env,
	stdio: 'inherit',
	verbose: true,
})`vite build`

// Move the _worker.js file built by Vite so that
// it can be imported by `src/lib/worker.ts`
await fs.move(
	`${baseDir}/.svelte-kit/cloudflare/_worker.js`,
	`${baseDir}/.svelte-kit/cloudflare/_worker_base.js`,
)

// Bundle everything together so that our Svelte app and
// the cron handler are exported by _worker.js
await esbuild.build({
	entryPoints: [`${baseDir}/src/lib/_worker.ts`],
	outfile: `${baseDir}/.svelte-kit/cloudflare/_worker.js`,
	logLevel: 'info',
	target: 'es2022',
	format: 'esm',
	bundle: true,
	treeShaking: true,
	external: ['node:events', 'node:async_hooks', 'node:buffer'],
})
