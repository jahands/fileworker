<script lang="ts">
	import { Heading, P } from 'flowbite-svelte'
	import { Button, Input, Label } from 'flowbite-svelte';
	import Body from '$lib/components/Body.svelte'

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
			const respText = await resp.text()
			alert(`Response was ${respText}`)
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
    <title>Deletion</title>
</svelte:head>

<Body>
	<Heading tag="h2" class="mb-4">Deletion page</Heading>
	<P class="mb-4">Search for a file to delete.</P>
	<form onsubmit={submit}>
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
					Submitting...
				{:else}
					Submit
				{/if}
			</Button>
		</div>
	</form>
</Body>
