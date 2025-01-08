<script lang="ts">
	import AlertFeed from '$lib/components/AlertFeed.svelte'
	import Body from '$lib/components/Body.svelte'
	import FileInfoCard from '$lib/components/FileInfoCard.svelte'
	import { Button, Card, Fileupload, Heading, Helper, Label, P } from 'flowbite-svelte'

	let alertFeed: AlertFeed

	let files = $state<FileList>()
	let filename = $state('')
	let file_id = $state('')

	$effect(() => {
		if (files) {
			submit()
		}
	})

	async function submit() {
		try {
			const file = files?.item(0)
			if (!file) {
				return
			}

			const resp = await fetch(`/api/file/${file.name}`, {
				method: 'PUT',
				body: file,
			})

			switch (resp.status) {
				case 200:
					const json: { file_id: string; filename: string } = await resp.json()
					if (!json.file_id) {
						alertFeed.showAlert(`File upload unable to parse response.`, { type: 'error' })
						return
					}
					file_id = json.file_id
					filename = json.filename

					alertFeed.showAlert(`File upload successful.`, { type: 'success' })
					break
				default:
					alertFeed.showAlert(`Failed to upload file "${file.name}".`, { type: 'error' })
					break
			}
		} finally {
		}
	}
</script>

<svelte:head>
	<title>Upload</title>
</svelte:head>

<Body>
	<Heading tag="h2" class="mb-4">Upload page</Heading>
	<P class="mb-4">Easy file sharing from the command line</P>
	<Label for="with_helper" class="pb-2">Upload file</Label>
	<Fileupload id="with_helper" name="file_drop" bind:files class="mb-2" />
	<Helper>Click here or drag a file</Helper>

	<div class="mb-4">
		<AlertFeed bind:this={alertFeed} />
	</div>

	{#if file_id !== ''}
		<div class="mb-4">
			<FileInfoCard class="mx-auto" showDownload={true} {file_id} {filename} />
		</div>
	{/if}
</Body>
