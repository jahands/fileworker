<script lang="ts">
	let { children } = $props();
</script>

<div class="container px-4 mx-auto">
	{@render children?.()}
</div>
