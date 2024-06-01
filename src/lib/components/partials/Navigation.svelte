<script lang="ts">
	import { useAuthStore } from '$lib/stores/auth';
	import { modalLogin, modalSignup } from '$lib/config/modal';
	import type { DrawerStore, ModalStore } from '@skeletonlabs/skeleton';
	import { useUsersStore } from '$lib/stores/user';

	export let drawer: DrawerStore;
	export let modal: ModalStore;

	const authStore = useAuthStore();
	const { userStore } = useUsersStore();
</script>

<aside class="flex flex-col h-full pt-3">
	<h2 class="text-center py-2 text-slate-800 font-medium text-[1.2rem]">Rapid <span class="font-bold text-pink-600">Eats</span></h2>
	<nav class="mt-5">
		<div class="flex flex-col gap-2">
			{#if $authStore}
				<div>

				</div>
			{:else}
				<div>
					<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalSignup)} data-sveltekit-preload-data="hover" class="btn bg-pink-600 hover:bg-pink-700 transition-all duration-300 w-full rounded-lg text-white text-lg font-medium active:scale-[0.9]">Créer un compte</a>
				</div>
				<div>
					<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalLogin)} data-sveltekit-preload-data="hover" class="btn bg-slate-200 hover:bg-slate-300 transition-all duration-300 w-full rounded-lg text-slate-800 text-lg font-medium active:scale-[0.9]">Se connecter</a>
				</div>
			{/if}
		</div>
	</nav>
	<div class="mt-4 leading-8">
		<div>
			<a href="/" class="text-[.9rem] font-medium hover:underline text-slate-800">Ajoutez votre restaurant</a>
		</div>
		<div>
			<a href="/" class="text-[.9rem] font-medium hover:underline text-slate-800">Devenez coursier</a>
		</div>
	</div>
	<div class="flex mt-auto pb-2">
		<p class="text-slate-800 font-medium text-sm">Rapid <span class="font-bold text-pink-600">Eats</span> © { new Date().getFullYear() }</p>
	</div>
</aside>
