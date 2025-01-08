<script lang="ts">
	import { Button, Heading, Input, Label, P, Spinner } from 'flowbite-svelte';
	import AlertFeed from '$lib/components/AlertFeed.svelte'
	import Body from '$lib/components/Body.svelte'
	import FileInfoCard from '$lib/components/FileInfoCard.svelte'

	let alertFeed: AlertFeed;

	let fileIdentifier = $state("")
	let filename = $state("")
	let searching = $state(false)

	function reset() {
		filename = ""
	}

	async function submit() {
		searching = true;
		try {
			const resp = await fetch(`/api/file/search/${fileIdentifier}`, {
				method: 'GET',
			})

			switch (resp.status) {
				case 200:
				case 202:
				case 204:
					alertFeed.showAlert(`File "${fileIdentifier}" lookup successful.`, { type: 'success' })
					break
				case 404:
					alertFeed.showAlert(`File "${fileIdentifier}" not found.`, { type: 'warning' })
					break
				default:
					alertFeed.showAlert(`File "${fileIdentifier}" lookup error.`, { type: 'error' })
					break
			}

			const json: { filename: string } = await resp.json()
			if (!json.filename) {
					alertFeed.showAlert(`File "${fileIdentifier}" unable to parse response.`, { type: 'error' })
					return
			}
			filename = json.filename
		} catch {
			alertFeed.showAlert(`File "${fileIdentifier}" unexpected error.`, { type: 'error' })
		} finally {
			searching = false
		}
	}
</script>

<svelte:head>
    <title>Download</title>
</svelte:head>

<Body>
	<Heading tag="h2" class="mb-4">Download page</Heading>
	<P class="mb-4">Search for a file to download.</P>
	<form class="mb-4" onsubmit={submit}>
		<div class="mb-4">
			<div>
				<Label class="mb-2">File identifier</Label>
				<Input type="text" id="file_id" bind:value={fileIdentifier} placeholder="File identifier" class="mb-2" on:input={reset} required />
			</div>
		</div>
		<div class="text-center">
			<Button type="submit" disabled={searching}>
				{#if searching}
					<Spinner class="me-4" color="white" size=4 />Looking...
				{:else}
					Lookup
				{/if}
			</Button>
		</div>
	</form>
	<div class="mb-4">
		<AlertFeed bind:this={alertFeed} />
	</div>
	{#if fileIdentifier && filename}
		<div class="mb-4">
			<FileInfoCard class="mx-auto" fileIdentifier={fileIdentifier} filename={filename} />
		</div>
	{/if}
</Body>
