<script lang="ts">
	import { Button, Heading, Input, Label, P, Spinner } from 'flowbite-svelte';
	import AlertFeed from '$lib/components/AlertFeed.svelte'
	import Body from '$lib/components/Body.svelte'

	let alertFeed: AlertFeed;

	let fileIdentifier = $state("")
	let fileDeletionToken = $state("")
	let submitting = $state(false);

	async function submit() {
		submitting = true;
		try {
			const resp = await fetch(`/api/file/${fileIdentifier}`, {
				method: 'DELETE',
				body: JSON.stringify({
					deletionToken: fileDeletionToken
				}),
			})
			switch (resp.status) {
				case 200:
				case 202:
				case 204:
					alertFeed.showAlert(`File "${fileIdentifier}" deletion successful. Ready to delete more.`, { type: 'success' })
					fileIdentifier = ""
					fileDeletionToken = ""
					break
				case 404:
					alertFeed.showAlert(`File "${fileIdentifier}" not found.`, { type: 'warning' })
					break
				default:
					alertFeed.showAlert(`File "${fileIdentifier}" deletion error.`, { type: 'error' })
					break
			}
		} finally {
			submitting = false
		}
	}
</script>

<svelte:head>
    <title>Deletion</title>
</svelte:head>

<Body>
	<Heading tag="h2" class="mb-4">Deletion page</Heading>
	<P class="mb-4">Search for a file to delete.</P>
	<form class="mb-4" onsubmit={submit}>
		<div class="mb-4">
			<div>
				<Label class="mb-2">File identifier</Label>
				<Input type="text" id="file_id" bind:value={fileIdentifier} placeholder="File identifier" class="mb-2" required />
			</div>
			<div>
				<Label class="mb-2">Deletion token</Label>
				<Input type="text" id="file_delete_token" bind:value={fileDeletionToken} placeholder="Deletion token" class="mb-2" required />
			</div>
		</div>
		<div class="text-center">
			<Button type="submit" disabled={submitting}>
				{#if submitting}
					<Spinner class="me-4" color="white" size=4 />Deleting...
				{:else}
					Delete
				{/if}
			</Button>
		</div>
	</form>
	<AlertFeed bind:this={alertFeed} />
</Body>
