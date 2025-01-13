import { Toucan } from 'toucan-js'

export function initSentry({
	request,
	ctx,
	dsn,
	release,
}: {
	request: Request
	ctx: Pick<ExecutionContext, 'waitUntil'>
	dsn: string
	release: string
}): Toucan {
	return new Toucan({
		dsn,
		context: ctx,
		release,
		request,
		requestDataOptions: {
			allowedHeaders: [
				'user-agent',
				'cf-challenge',
				'accept-encoding',
				'accept-language',
				'cf-ray',
				'content-length',
				'content-type',
				'host',
			],
			// Don't allow the `key` param to be logged
			allowedSearchParams: /^(?!(key)$).+$/,
		},
	})
}
