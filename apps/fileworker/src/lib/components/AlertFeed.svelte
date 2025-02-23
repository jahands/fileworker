<script lang="ts" module>
	export type AlertType = 'success' | 'warning' | 'error'
</script>

<script lang="ts">
	import { Alert } from 'flowbite-svelte'

	let props = $props()

	export function computeColor(type: AlertType) {
		switch (type) {
			case 'success':
				return 'green'
			case 'warning':
				return 'orange'
			case 'error':
				return 'red'
			default:
				return 'red'
		}
	}

	let idSequence = 0
	let alerts: { id: string; color: string; message: string }[] = $state([])
	export function showAlert(
		message: string,
		{ type = 'error', durationMillis = 7500 }: { type?: AlertType; durationMillis?: number },
	) {
		idSequence++
		const id = `alert-${idSequence}`
		const color = computeColor(type)
		alerts.push({ id, color, message })
		setTimeout(() => {
			alerts = alerts.filter((a) => a.id != id)
		}, durationMillis)
		console.log(durationMillis)
	}
</script>

<div {...props}>
	{#each alerts as a (a.id)}
		<Alert id={a.id} color={a.color} {...props} class="mb-2">{a.message}</Alert>
	{/each}
</div>
