<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';
	import Masonry from 'svelte-bricks';
	import MenuCard from '$lib/components/app/MenuCard.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { config, Map, MapStyle, Marker } from '@maptiler/sdk';
	import { Notation } from '$lib';

	const { restaurantStore } = useUsersStore();

	$: restaurant = $restaurantStore;

	config.apiKey = 'BDnu8t7usofNcbcmeIBe';
	let map: Map;
	let mapContainer: HTMLElement;

	onMount(async () => {
		const initialState = {lng: -2.758239, lat: 47.657487, zoom: 13};
		const coords: [number, number] = [parseFloat($restaurantStore.longitude), parseFloat($restaurantStore.latitude)];

		map = new Map({
			container: mapContainer,
			style: MapStyle.STREETS.DEFAULT,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			geolocateControl: false,
			navigationControl: false,
			interactive: false
		});

		map.setCenter(coords)

		new Marker({ color: '#db2777' }).setLngLat(coords).addTo(map);
	});

	const handleAnchor = (event: Event) => {
		event.preventDefault();
		const link = event.currentTarget as HTMLAnchorElement;
		const anchorId = new URL(link.href).hash.replace('#', '');
		const anchor = document.getElementById(anchorId);

		window.scrollTo({
			top: anchor.offsetTop,
			behavior: 'smooth'
		});
	}

	onDestroy(() => {
		map && map.remove();
	});
</script>

<svelte:head>
	<title>Rapid Eats | { $restaurantStore.title.toCapitalize() }</title>
</svelte:head>

<div class="container mx-auto max-w-[1200px] px-5 pb-5">
	<img src={$restaurantStore.coverURL} alt={$restaurantStore.title} class="w-full shadow-md object-cover rounded-b-2xl h-72">
	<div class="my-4 px-4">
		<h1 class="text-slate-800 font-bold text-3xl">{ $restaurantStore.title.toCapitalize() }</h1>
		<div class="flex mb-3">
			<Notation note={$restaurantStore.note}/>
		</div>
		<p class="text-slate-800 font-medium text-base mt-1">{ $restaurantStore.description }</p>
		<div class="flex items-center md:h-72 flex-wrap md:flex-nowrap w-full md:mt-10 mt-10">
			<div class="flex flex-col items-baseline h-full w-full text-slate-800 font-semibold">
				<p>{ $restaurantStore.address.street }</p>
				<p>{ $restaurantStore.address.postalCode }</p>
				<p>{ $restaurantStore.address.city }</p>
				<p>{ $restaurantStore.phone.replace(/(\d{2})(?=\d)/g, '$1 ') }</p>

				{#if $restaurantStore.email.startsWith('https://')}
					<a href={$restaurantStore.email} target="_blank" class="bg-pink-600 inline-flex text-white text-sm font-medium px-3 py-1.5 mt-3 rounded-2xl hover:bg-pink-700 transition-colors duration-300">Contacter le restaurant</a>
				{:else}
					<p>{ $restaurantStore.email }</p>
				{/if}

				<a href="#menus" class="bg-pink-600 inline-flex text-white rounded-2xl text-sm font-medium px-3 py-1.5 items-center mt-2 mb-2 hover:bg-pink-700 transition-colors duration-300" on:click={handleAnchor}>Voir les menus</a>
			</div>
			<div class="flex ml-auto overflow-hidden rounded-2xl shadow-md w-full md:my-10 my-5">
				<div class="map-track top-0 w-full h-72 flex overflow-hidden relative">
					<div class="absolute w-full h-full" bind:this={mapContainer}/>
				</div>
			</div>
		</div>
		<div class="mt-5">
			<h2 class="text-slate-800 font-bold text-2xl mb-3" id="menus">Menus</h2>
			{#if restaurant.menus.length > 0}
				<Masonry idKey="uid" items={restaurant.menus} minColWidth={300} gap={20} animate={false} let:item>
					<MenuCard data={item} restaurantUID={$restaurantStore.uid} restaurantTitle={$restaurantStore.title} type="null"/>
				</Masonry>
			{/if}
		</div>
	</div>
</div>
