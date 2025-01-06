import { Command } from '@commander-js/extra-typings'
import Table from 'cli-table3'
import { match } from 'ts-pattern'
import { z } from 'zod'

import { validateArg } from '../args'
import { cliError } from '../errors'
import { getRepoRoot } from '../path'

export const runCmd = new Command('run')
	.description('run commands in various packages with given filter')
	.requiredOption(
		'-F, --filter <string>',
		'filter preset for which packages to run within',
		validateArg(z.enum(['with-wrangler-config']))
	)
	.option('-y, --yes', 'Auto-confirm to run within dirs', false)
	.argument('<cmd...>', 'command to run - recommend adding -- first')
	.action(async (args, { filter, yes }) => {
		const repoRoot = await getRepoRoot()

		const dirs = await match(filter)
			// Add all filters here
			.with('with-wrangler-config', async () => {
				cd(repoRoot)
				const wranglerConfigs = await glob('*/*/wrangler.jsonc')
				const dirs = wranglerConfigs.map((wt) => path.dirname(wt))
				return dirs
			})
			.exhaustive()

		dirs.sort()

		await runCmdInDirectories({ args, dirs, yes })
	})

async function runCmdInDirectories({
	args,
	dirs,
	yes,
}: {
	args: string[]
	dirs: string[]
	yes: boolean
}): Promise<void> {
	const repoRoot = await getRepoRoot()

	const table = new Table({
		head: [chalk.whiteBright('Directories')],
	})
	for (const dir of dirs) {
		table.push([chalk.white(dir)])
	}
	echo(table.toString())

	console.log('Command: ', args)
	if (!yes) {
		const ans = await question('Run this command in the above directories? (yN) ', {
			choices: ['y', 'n'],
		})
		if (ans !== 'y') {
			throw cliError('Aborting!')
		}
	}

	for (const dir of dirs) {
		cd(`${repoRoot}/${dir}`)
		echo(chalk.blue(`\nRunning within: ${process.cwd()}`))
		await $({ stdio: 'inherit', verbose: true })`${args}`
	}
}
