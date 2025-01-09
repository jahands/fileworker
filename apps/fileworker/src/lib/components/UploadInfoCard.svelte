<script lang="ts">
	import { page } from '$app/state'
	import { Card, GradientButton, Input } from 'flowbite-svelte'

	let {
		file_id,
		filename,
		deletionToken,
		...rest
	}: {
		file_id: string
		filename: string
		deletionToken?: string
		[key: string]: unknown
	} = $props()

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
			<div class="flex justify-between content-center gap-4 mb-6">
				<Input value={deletionToken} disabled class="disabled:opacity-100 disabled:cursor-default"  />
				<GradientButton onclick={() => clickToCopy(deletionToken)} outline color="greenToBlue" class="flex-none">
					Copy token
				</GradientButton>
				<GradientButton onclick={() => {/**TODO*/}} color="red" class="flex-none">
					Delete
				</GradientButton>
			</div>	
		</div>
	{/if}

</Card>


