import 'zx/globals'

import { fileURLToPath } from 'url'
import { program } from '@commander-js/extra-typings'
import { z } from 'zod'

program
	.name('deploy')
	.action(async () => {
		const baseDir = path.resolve(path.basename(fileURLToPath(import.meta.url)), '..')
		cd(baseDir)

		$.env = process.env
		const $$ = $({ stdio: 'inherit', verbose: true })

		// First, build the app
		await $$`npm run build`

		// Get the version to use for Sentry
		const pkgJsonVersion = z
			.object({ version: z.string().min(1) })
			.parse(JSON.parse((await fs.readFile(`./package.json`)).toString())).version
		const gitSha = await $`git log -1 --pretty=format:%h`.text()

		// E.g. 0.0.1-a1c696f
		const deployVersion = `${pkgJsonVersion}-${gitSha}`

		const flags: string[] = [
			'--var',
			`SENTRY_RELEASE:${deployVersion}`,
		]

		await $$`wrangler deploy ${flags}`
	})
	.parseAsync()
	.catch((e) => {
		if (e instanceof ProcessOutput) {
			process.exit(1)
		} else {
			throw e
		}
	})
