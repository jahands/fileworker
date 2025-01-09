// @ts-ignore This file won't exist until it's built
import worker from '../../.svelte-kit/cloudflare/_worker_base'
import { handleCron } from './cron'

// The SvelteKit Vite plugin does not give us a way
// to export other handlers, so we have to do it manually.
// This file gets built by `scripts/build.ts` after the main
// app gets built.

export default {
	...worker,
	scheduled: handleCron,
}
