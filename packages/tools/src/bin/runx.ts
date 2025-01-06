import 'zx/globals'

import { program } from '@commander-js/extra-typings'

import { buildCmd } from '../cmd/build'
import { deployCmd } from '../cmd/deploy'
import { parseChangesetCmd } from '../cmd/parse-changeset'
import { runCmd } from '../cmd/run'
import { sentryCmd } from '../cmd/sentry'
import { updatePnpmCmd } from '../cmd/update-pnpm'
import { updateWranglerTomlsCmd } from '../cmd/update-wrangler-tomls'

program
	.name('runx')
	.description('A CLI for scripts that automate this repo')

	.addCommand(updatePnpmCmd)
	.addCommand(parseChangesetCmd)
	.addCommand(buildCmd)
	.addCommand(deployCmd)
	.addCommand(sentryCmd)
	.addCommand(runCmd)
	.addCommand(updateWranglerTomlsCmd)

	// Don't hang for unresolved promises
	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch((e) => {
		if (e instanceof ProcessOutput) {
			process.exit(1)
		} else {
			throw e
		}
	})
