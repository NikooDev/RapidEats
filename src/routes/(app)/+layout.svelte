<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';

	const { userStore } = useUsersStore();
</script>

<svelte:head>
	<meta name="description" content="Avec Rapid Eats, faites-vous livrer chez vous les plats de vos restaurants préférés sur Vannes">
</svelte:head>

{#if $userStore}
	<slot/>
{:else}
	<div class="flex justify-center items-center mt-64 w-full">
		<p class="text-slate-800 text-3xl font-medium text-center">Redirection en cours...</p>
	</div>
{/if}
