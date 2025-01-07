import { SELF } from 'cloudflare:test'

function route(path: string) {
	return `https://example.com${path}`
}

export class TestClient {
	/**
	 * PUT /api/file/:filename
	 */
	async uploadFile(filename: string, file: BodyInit): Promise<Response> {
		return SELF.fetch(route(`/api/file/${filename}`), {
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
	 * DELETE /api/file/:file_id/:filename
	 */
	async deleteFile(fileId: string): Promise<Response> {
		let url = route(`/api/file/${fileId}`)
		return SELF.fetch(url, {
			method: 'DELETE',
		})
	}

	get fetch() {
		return SELF.fetch.bind(SELF)
	}
}
