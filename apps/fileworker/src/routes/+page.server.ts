import { redirect } from '@sveltejs/kit'

export function load() {
	throw new Error('boom!')
	redirect(307, '/app')
}
