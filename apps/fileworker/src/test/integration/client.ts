import { SELF } from 'cloudflare:test'

function route(path: string) {
	return `https://example.com${path}`
}

export class TestClient {
	/**
	 * PUT /api/file/:filename
	 */
	async uploadFile(filename: string, file: BodyInit, expiration_ttl?: number): Promise<Response> {
		const url = new URL(route(`/api/file/${filename}`))
		if (expiration_ttl) {
			url.searchParams.set('expiration_ttl', expiration_ttl.toString())
		}
		return SELF.fetch(url.toString(), {
			method: 'PUT',
			body: file,
		})
	}

	/**
	 * GET /api/file/:file_id/:filename
	 */
	async downloadFileAPI(fileId: string, filename: string): Promise<Response> {
		let url = route(`/api/file/${fileId}/${filename}`)
		return SELF.fetch(url)
	}

	/**
	 * GET /:file_id/:filename
	 */
	async downloadFile(fileId: string, filename: string): Promise<Response> {
		let url = route(`/${fileId}/${filename}`)
		return SELF.fetch(url)
	}

	/**
	 * GET /api/file/search/:file_id
	 */
	async searchFile(fileId: string): Promise<Response> {
		let url = route(`/api/file/search/${fileId}`)
		return SELF.fetch(url)
	}

	/**
	 * DELETE /api/file/:file_id/:filename
	 */
	async deleteFile(fileId: string, delete_token: string): Promise<Response> {
		let url = new URL(route(`/api/file/${fileId}`))
		url.searchParams.set('delete_token', delete_token)

		return SELF.fetch(url.toString(), {
			method: 'DELETE',
		})
	}

	get fetch() {
		return SELF.fetch.bind(SELF)
	}
}
