<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
	import { Notation } from '$lib';
	import { mapMarker, mapPopup } from '$lib/helpers/template';
	import type { RestaurantType } from '$lib/interfaces/user';
	import '@maptiler/sdk/dist/maptiler-sdk.css';

	const insertComponent = (container: Element, props: { note: number }) => {
		if (container instanceof Element) {
			new Notation({
				target: container,
				props: props
			});
		} else {
			console.error('Le conteneur fourni n\'est pas un élément DOM.');
		}
	}

	let map: Map;
	let mapContainer: HTMLElement;

	export let restaurants: RestaurantType[];

	config.apiKey = 'BDnu8t7usofNcbcmeIBe';

	onMount(() => {
		const initialState = { lng: -2.758239, lat: 47.657487, zoom: 11.5 };

		map = new Map({
			container: mapContainer,
			style: MapStyle.STREETS.DEFAULT,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			minZoom: 11.5
		});

		restaurants.map((restaurant) => {
			const latitude = parseFloat(restaurant.latitude),
				longitude = parseFloat(restaurant.longitude);

			const popupContent = document.createElement('div');
			popupContent.innerHTML = mapPopup(restaurant);

			const popup = new Popup({ offset: 25, maxWidth: '350px' }).setDOMContent(popupContent);

			const markerContent = document.createElement('div');
			markerContent.innerHTML = mapMarker();

			popup.on('open', () => {
				markerContent.classList.add('popup-open');
			});

			popup.on('close', () => {
				markerContent.classList.remove('popup-open');
			});

			new Marker({element: markerContent, color: 'rgb(219 39 119'}).setPopup(popup).setLngLat([longitude, latitude]).addTo(map);

			const container = popupContent.querySelector(`#note-${restaurant.uid}`);
			if (container) {
				insertComponent(container, { note: restaurant.note });
			}
		});
	});

	onDestroy(() => {
		map && map.remove();
	});
</script>

<div class="map-wrap sticky top-16 right-0 w-full hidden sm:flex">
	<div class="absolute w-full h-full" bind:this={mapContainer}/>
</div>
