import { defineWorkspace } from 'vitest/config'
import { glob } from 'zx'

const projects = await glob([
	// All vitest projects
	'{apps,packages}/*/vitest.config.ts',
])

export default defineWorkspace([
	// Run all non-isolated projects together.
	...projects,
])
