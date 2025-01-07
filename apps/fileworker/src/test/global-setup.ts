import childProcess from 'node:child_process'
import path from 'node:path'

// Global setup runs inside Node.js, not `workerd`
export default function () {
	const label = 'Build worker'
	console.time(label)
	childProcess.execSync('pnpm run build', {
		cwd: path.join(__dirname),
	})
	console.timeEnd(label)
}
