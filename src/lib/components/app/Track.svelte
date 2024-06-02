<script lang="ts">
	import { StatusEnum } from '$lib/interfaces/user';
	import { OrderEnum, type OrderType } from '$lib/interfaces/order';
	import { config, GeoJSONSource, LngLatBounds, Map, MapStyle, Marker } from '@maptiler/sdk';
	import { keyGraphHopper, keyMapTiler } from '$lib/config/app';
	import { orderStore } from '$lib/stores/order';
	import { toastSuccess } from '$lib/config/toast';
	import { onDestroy, onMount } from 'svelte';
	import { useUsersStore } from '$lib/stores/user';
	import { addLayer, addSource, convertMsToDate, textMarker } from '$lib/helpers/map';
	import { setPoints } from '$lib/components/app/order/geojson';
	import { mapDeliveryMarker } from '$lib/helpers/template';
	import { setOrder, setProfile } from '$lib/firebase/client';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { Point, RouteResponse } from 'graphhopper-ts-client';

	export let order: OrderType;

	config.apiKey = keyMapTiler;

	const query = new URLSearchParams({
		key: keyGraphHopper
	}).toString();
	const toastStore = getToastStore();
	const { userStore, deliverymanStore } = useUsersStore();
	const traceCoordinates: number[][] = [];

	let map: Map;
	let mapContainer: HTMLElement;
	let index: number = 0;
	let timeRoute: string = '';

	const coords = order.restaurants.map(restaurant => ({
		lat: parseFloat(restaurant.latitude),
		lng: parseFloat(restaurant.longitude),
		title: restaurant.title,
		type: 'restaurant'
	}));

	coords.push({
		lat: parseFloat($userStore.latitude),
		lng: parseFloat($userStore.longitude),
		title: `${$userStore.firstname.toCapitalize()} ${$userStore.lastname.toCapitalize()}`,
		type: 'customer'
	});

	let markerDeliveryman: Marker;
	const markerContent = document.createElement('div');
	markerContent.innerHTML = mapDeliveryMarker();

	const track = async () => {
		try {
			const apiPoints = coords.map(point => [point.lng, point.lat]);
			const geojson = setPoints(apiPoints)

			const req = await fetch(`https://graphhopper.com/api/1/route?${query}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(geojson)
			});

			const result = await req.json() as RouteResponse;
			const points = result.paths[0].points as Point & string
			const route = points.coordinates;

			const milliseconds = result.paths[0].time;

			const dateDelivered = convertMsToDate(milliseconds / 1.75);

			timeRoute = `${dateDelivered.m} minutes et ${dateDelivered.s} secondes`;

			addSource(map, 'route', route);
			addLayer(map, 'route', 'line', '#1e293b');

			addSource(map, 'track', []);
			addLayer(map, 'track', 'line', '#db2777');

			addSource(map, 'trace', []);
			addLayer(map, 'trace', 'line', '#db2777');

			return route;
		} catch (err) {
			console.log(err);
		}
	}

	const animateMarker = async (route: number[][], markerDeliveryman: Marker, traceCoordinates: number[][]) => {
		if (index < route.length) {
			markerDeliveryman.setLngLat(route[index] as [number, number]);
			traceCoordinates.push(route[index]);

			map.getSource('trace') && (map.getSource('trace') as GeoJSONSource).setData({
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: traceCoordinates
				}
			});

			index++;

			setTimeout(() => requestAnimationFrame(() => animateMarker(route, markerDeliveryman, traceCoordinates)), 1000 / 30);
		} else {
			markerContent.classList.add('animate-finish');
			orderStore.update(oldStore => ({ ...oldStore, status: OrderEnum.DELIVERED }));

			await setProfile({
				uid: $deliverymanStore.uid,
				status: StatusEnum.AVAILABLE
			}, $userStore.uid, { deliveryman: { status: StatusEnum.AVAILABLE }}, 'orders', order.uid);
			await setOrder($userStore.uid, order.uid, { ...order, deliveryman: { ...$deliverymanStore, latitude: $userStore.latitude, longitude: $userStore.longitude }, status: OrderEnum.DELIVERED }).then(() => {
				toastStore.trigger({ ...toastSuccess, message: 'Votre commande a bien été livrée.\nRetrouvez-là dans :\nGérer le compte > Historique des commandes.', timeout: 7000, hideDismiss: true });
			});
		}
	}

	onMount(async () => {
		const user = {
			uid: order.deliveryman.uid,
			longitude: order.restaurants[0].longitude,
			latitude: order.restaurants[0].latitude
		};

		await setProfile(user, $userStore.uid, { deliveryman: user }, 'orders', order.uid).then(() => {
			order.deliveryman.latitude = user.latitude;
			order.deliveryman.longitude = user.longitude;
		});

		map = mapContainer && new Map({
			container: mapContainer,
			style: MapStyle.STREETS.DEFAULT,
			center: [0, 0],
			zoom: 1,
			scrollZoom: false,
			doubleClickZoom: false,
			navigationControl: false
		});

		coords.forEach(point => {
			new Marker({ color: point.type === 'customer' ? '#db2777' : '#1e293b' })
				.setLngLat([point.lng, point.lat])
				.addTo(map);

			if (point.title) {
				new Marker({ element: textMarker(point.title, point.type === 'customer') }).setLngLat([point.lng, point.lat]).addTo(map);
			}
		});

		deliverymanStore.subscribe((deliveryman) => {
			markerDeliveryman = new Marker({ element: markerContent }).setLngLat([parseFloat(deliveryman.longitude), parseFloat(deliveryman.latitude)]).addTo(map);
		});

		const bounds = new LngLatBounds();
		const padding = Math.max(20, 100 - (coords.length - 2) * 10);

		coords.forEach(point => bounds.extend([point.lng, point.lat]));
		map.fitBounds(bounds, { padding });

		map.on('load', async () => {
			const route = await track();

			if (route && markerDeliveryman && traceCoordinates) {
				await animateMarker(route, markerDeliveryman, traceCoordinates);
			}
		});
	});

	onDestroy(() => {
		map && map.remove();
	});
</script>

{#if timeRoute}
	<div class="flex gap-2 py-1.5 px-3 text-slate-800 shadow-md font-semibold text-base absolute top-0 z-10 backdrop-blur rounded-br-2xl">
		<p>Temps estimé : { timeRoute }</p>
	</div>
{/if}
<div class="sm:map-wrap h-[27rem]">
	<div class="absolute w-full h-full" bind:this={mapContainer}/>
</div>
