<script lang="ts">
	import AlertFeed from '$lib/components/AlertFeed.svelte'
	import Body from '$lib/components/Body.svelte'
	import { Dropzone, Fileupload, Heading, Helper, Label, P, Spinner } from 'flowbite-svelte'
	import UploadInfoCard from '$lib/components/UploadInfoCard.svelte';
	import type { UploadFileResponse } from '$lib/api'

	let alertFeed: AlertFeed

	let files = $state<FileList>()
	let candidateFiles = $derived.by(() => {
		const length = files?.length
		const candidateFiles: File[]  = []
		for (var i = 0; i < (length || 0); i++) {
			const file = files?.item(0)
			if (file) {
				candidateFiles.push(file)
			}
		}
		return candidateFiles
	})
	let submitting = $state(false)
	
	let uploadedFiles = $state<UploadFileResponse[]>([])

	function onDropzoneDrop(event: DragEvent) {
		event.preventDefault()
		const eventFiles = event.dataTransfer?.files
		if (eventFiles) {
			files = eventFiles
		}
	}

	function onDropzoneChange(event: Event) {
		event.preventDefault()
		const eventFiles = (event.target as HTMLInputElement)?.files
		if (eventFiles) {
			files = eventFiles
		}
	}

	function onDropzoneDragover(event: Event) {
		event?.preventDefault()
	}

	$effect(() => {
		if (candidateFiles.length > 0) {
			candidateFiles.forEach(f => {
				submitFile(f)
			})
		}
	})

	async function submitFile(file: File) {
		submitting = true
		try {
			const resp = await fetch(`/api/file/${file.name}`, {
				method: 'PUT',
				body: file,
			})
			switch (resp.status) {
				case 200:
					const json: UploadFileResponse = await resp.json()
					if (!json.file_id) {
						alertFeed.showAlert(`File upload unable to parse response.`, { type: 'error' })
						return
					}
					uploadedFiles.push(json)
					
					alertFeed.showAlert(`File upload successful.`, { type: 'success' })
					break
				default:
					alertFeed.showAlert(`Failed to upload file "${file.name}".`, { type: 'error' })
					break
			}
		} finally {
			submitting = false
		}
	}

	function onDelete(file_id: string) {
		uploadedFiles = uploadedFiles.filter(f => f.file_id !== file_id) 
		alertFeed.showAlert(`File deletion successful.`, {
			type: 'success',
		})
	}
</script>

<svelte:head>
	<title>Upload</title>
</svelte:head>

<Body>
	<Heading tag="h2" class="mb-4">Upload page</Heading>
	<P class="mb-4">Easy file sharing from the command line</P>
	<form class="mb-4">
		<Label for="with_helper" class="mb-2">
			Upload file
			{#if submitting}
				<Spinner class="me-4" size="4" />
			{/if}
		</Label>
		<Fileupload id="with_helper" name="file_drop" bind:files class="mb-2" />
		<Dropzone
			id="dropzone"
			on:drop={onDropzoneDrop}
			on:change={onDropzoneChange}
			on:dragover={onDropzoneDragover}
		>
			<svg
				aria-hidden="true"
				class="mb-3 w-10 h-10 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>
			{#if candidateFiles.length === 0}
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">Click to upload</span>
					 or drag and drop.
				</p>
			{:else}
				{#each candidateFiles as candidateFile}
					<p class="mb-2">{candidateFile.name}</p>
				{/each}
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">Click to upload another file</span>
					 or drag and drop.
				</p>
			{/if}
		</Dropzone>
	</form>

	<div class="mb-4">
		<AlertFeed bind:this={alertFeed} />
	</div>

	{#each uploadedFiles as uploadedFile}
		<div class="mb-4">
			<UploadInfoCard class="mx-auto" 
				file_id={uploadedFile.file_id}  
				filename={uploadedFile.filename}
				deletionToken={uploadedFile.delete_token} 
				onDelete={onDelete} 
			/>
		</div>
	{/each}
</Body>
