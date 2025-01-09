<script lang="ts">
	import { page } from '$app/state'
	import AlertFeed from '$lib/components/AlertFeed.svelte'
	import { Card, GradientButton, Input, Spinner } from 'flowbite-svelte'

	let {
		file_id,
		filename,
		deletionToken,
		onDelete,
		...rest
	}: {
		file_id: string
		filename: string
		deletionToken?: string,
		onDelete: (file_id: string) => void,
		[key: string]: unknown
	} = $props()

	let submitting = $state(false)
	let alertFeed: AlertFeed

	const url = $derived.by(() => {
		let url = new URL(page.url)
		url.pathname = `/${file_id}/${filename}`
		return url
	})
	
	let urlText = $derived(url.toString())

	let curlText = $derived(`curl --remote-name '${urlText}'`)

	async function clickToCopy(text: string) {
		await navigator.clipboard.writeText(text);
	}
	async function submitDelete() {
		submitting = true
		try {
			const resp = await fetch(`/api/file/${file_id}?delete_token=${deletionToken}`, {
				method: 'DELETE',
				body: JSON.stringify({
					deletionToken: deletionToken,
				}),
			})
			switch (resp.status) {
				case 200:
				case 202:
				case 204:
					onDelete(file_id)
					break
				case 404:
					alertFeed.showAlert(`File not found.`, { type: 'warning' })
					break
				default:
					alertFeed.showAlert(`File deletion error.`, { type: 'error' })
					break
			}
		} finally {
			submitting = false			
		}
	}
</script>

<Card {...rest} class="max-w-full">
	<div class="flex justify-between content-center gap-4 mb-6">
		<Input value={urlText} disabled class="disabled:opacity-100 disabled:cursor-default"  />
		<GradientButton class="shrink-0 flex-none" onclick={() => clickToCopy(urlText)} outline color="greenToBlue" >
			Copy link
		</GradientButton>
	</div>
	
	<div class="flex justify-between content-center gap-4">
		<Input value={curlText} disabled class="disabled:opacity-100 disabled:cursor-default"  />
		<GradientButton onclick={() => clickToCopy(curlText)} outline color="greenToBlue" class="flex-none">
			Copy curl
		</GradientButton>
	</div>


	{#if deletionToken}
		<div class="mt-10">
			<h1 class="mb-4">Delete Token</h1>
			<AlertFeed bind:this={alertFeed} />
			<div class="flex justify-between content-center gap-4 mb-6">
				<Input value={deletionToken} disabled class="disabled:opacity-100 disabled:cursor-default"  />
				<GradientButton onclick={() => clickToCopy(deletionToken)} outline color="greenToBlue" class="flex-none">
					Copy token
				</GradientButton>
				<GradientButton onclick={submitDelete} color="red" disabled={submitting} class="flex-none">
					{#if submitting}
						<Spinner class="me-4" color="white" size="4" />Deleting...
					{:else}
						Delete
					{/if}
				</GradientButton>
			</div>	
		</div>
	{/if}
</Card>


