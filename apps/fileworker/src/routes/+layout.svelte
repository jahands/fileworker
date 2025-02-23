<script lang="ts">
	import { page } from '$app/state'
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte'

	import '../app.css'

	let { children } = $props()
	let activeUrl = $derived(page.url.pathname)
</script>

<div class="x-4 mx-auto" style:max-width="768px">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/app/upload">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				File Worker
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {activeUrl} {hidden}>
			<NavLi href="/app/upload">Upload</NavLi>
			<NavLi href="/app/download">Download</NavLi>
			<NavLi href="/app/delete">Delete</NavLi>
		</NavUl>
	</Navbar>

	{@render children()}
</div>
