import { GET as fileGET } from '../../api/file/[id]/+server'

import type { RequestHandler } from '@sveltejs/kit'

/**
 * GET is an alias for GET /api/file/:id.
 */
export const GET: RequestHandler<{ file_id: string; filename: string }> = (args) => {
	return fileGET({
		...args,
		params: {
			id: args.params.file_id,
			filename: args.params.filename,
		},
	})
}
