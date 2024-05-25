<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';
	import { useSettingsStore } from '$lib/stores/app';
	import { Map, RestaurantCard } from '$lib';
	import Masonry from 'svelte-bricks';

	const { restaurantStore } = useUsersStore();
	const { settingsStore } = useSettingsStore();

	$: restaurants = $restaurantStore;
</script>

<svelte:head>
	<title>Rapid Eats | Livraisons de repas</title>
	<meta name="description" content="Avec Rapid Eats, faites-vous livrer chez vous les plats de vos restaurants préférés sur Vannes">
</svelte:head>

<div class="{(!$settingsStore.maps) && 'container mx-auto'} flex w-full">
	<div class="{restaurants.length === 1 ? 'w-[40rem]' : 'w-full'} transition-all duration-300 pr-5 pl-4 py-5">
		{#if restaurants.length > 0}
		<Masonry idKey="uid" items={restaurants} minColWidth={$settingsStore.maps ? 250 : 300} gap={20} animate={false} let:item>
			<RestaurantCard data={item}/>
		</Masonry>
		{:else}
			<p class="flex items-center justify-center h-1/2 text-slate-800 font-medium text-lg text-center">Aucun restaurant ne correspond à votre recherche</p>
		{/if}
	</div>
	{#if $settingsStore.maps}
		<Map restaurants={$restaurantStore}/>
	{/if}
</div>
