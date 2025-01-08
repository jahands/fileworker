<script lang="ts">
	import { Card } from 'flowbite-svelte'
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/state'

	let { fileIdentifier, filename, deletionToken, showDownload = true, showCommand = true, ...rest }: {
		fileIdentifier: string,
		filename: string,
		deletionToken?: String,
		showDownload?: boolean,
		showCommand?: boolean,
		[key: string]: unknown,
	} = $props()

	const url = $derived.by(() => {
		let url = new URL(page.url)
		url.pathname = `/api/file/${fileIdentifier}/${filename}`
		return url
	})

	const urlAlt = $derived.by(() => {
		let url = new URL(page.url)
		url.pathname = `/${fileIdentifier}/${filename}`
		return url
	})
</script>

<Card {...rest}>
	<Table >
		<TableBody>
			<TableBodyRow>
				<TableBodyCell>Identifier</TableBodyCell>
				<TableBodyCell>{fileIdentifier}</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>Filename</TableBodyCell>
				<TableBodyCell>{filename}</TableBodyCell>
			</TableBodyRow>
			{#if deletionToken}
				<TableBodyRow>
					<TableBodyCell>DeletionToken</TableBodyCell>
					<TableBodyCell>{deletionToken}</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#if showDownload}
				<TableBodyRow>
					<TableBodyCell>Download URL</TableBodyCell>
					<TableBodyCell>
						<a class="font-medium text-primary-600 hover:underline" href="{url.toString()}">Download</a>
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>Download URL (alt)</TableBodyCell>
					<TableBodyCell>
						<a class="font-medium text-primary-600 hover:underline" href="{urlAlt.toString()}">Download</a>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#if showCommand}
				<TableBodyRow>
					<TableBodyCell>cURL command</TableBodyCell>
					<TableBodyCell>
						<code>curl --remote-name '{urlAlt.toString()}'</code>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		</TableBody>
	</Table>
</Card>
