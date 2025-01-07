<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import { page } from '$app/state'
	import '../app.css'

	let { children } = $props()
	let activeUrl = $derived(page.url.pathname)
</script>

<div
	class="x-4 mx-auto"
	style:max-width="768px">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/front/upload">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				File Worker
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {activeUrl} {hidden}>
			<NavLi href="/front/upload">Upload</NavLi>
			<NavLi href="/front/deletion">Deletion</NavLi>
		</NavUl>
	</Navbar>

	{@render children()}
</div>
