export function errorMissingPlatform() {
	return new Response('missing platform information', {
		status: 500,
	})
}
