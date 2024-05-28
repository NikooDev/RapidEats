<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { calculateDistance, calculateZoomLevel, textMarker } from '$lib/helpers/map';
	import { mapDeliveryMarker } from '$lib/helpers/template';
	import { config, GeoJSONSource, Map, MapStyle, Marker } from '@maptiler/sdk';
	import type { PointsCustomerDeliverymanType } from '$lib/interfaces/user';
	import type { RouteResponse, Point } from 'graphhopper-ts-client';
	import type { FeatureCollection, Point as Points } from 'geojson';
	import '@maptiler/sdk/dist/maptiler-sdk.css';

	let map: Map;
	let mapContainer: HTMLElement;

	export let geoUser: PointsCustomerDeliverymanType;
	export let geoDeliveryman: PointsCustomerDeliverymanType;
	export let fullName: string;
	export let restaurant: string;

	config.apiKey = 'BDnu8t7usofNcbcmeIBe';

	const query = new URLSearchParams({
		key: '4df65d10-6fac-429c-b8c5-1f2a5faa9f7f'
	}).toString();

	let timeRoute: string;
	let timeout: string | undefined;

	const trackStart = async () => {
		if (!geoUser.lat && !geoUser.lng && !geoDeliveryman.lat && !geoDeliveryman.lng) return;

		const D = calculateDistance(geoUser, geoDeliveryman);
		const Z = calculateZoomLevel(D);

		const centerLatitude = (geoUser.lat + geoDeliveryman.lat) / 2;
		const centerLongitude = (geoUser.lng + geoDeliveryman.lng) / 2;

		const initialState = { lng: centerLongitude, lat: centerLatitude, zoom: Z };

		map = new Map({
			container: mapContainer,
			style: MapStyle.STREETS.DEFAULT,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			minZoom: Z
		});

		new Marker({color: '#db2777'}).setLngLat([geoUser.lng, geoUser.lat]).addTo(map);
		new Marker({ element: textMarker(fullName, true) }).setLngLat([geoUser.lng, geoUser.lat]).addTo(map);

		new Marker({color: '#1e293b'}).setLngLat([geoDeliveryman.lng, geoDeliveryman.lat]).addTo(map);
		new Marker({ element: textMarker(restaurant, false) }).setLngLat([geoDeliveryman.lng, geoDeliveryman.lat]).addTo(map);

		const geojson: FeatureCollection<Points> = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [geoUser.lng, geoUser.lat]
					},
					properties: {
						title: 'Point 1',
					}
				},
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [geoDeliveryman.lng, geoDeliveryman.lat]
					},
					properties: {
						title: 'Point 2'
					}
				}
			]
		};

		try {
			const req = await fetch(`https://graphhopper.com/api/1/route?${query}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'points': [
						[geoDeliveryman.lng, geoDeliveryman.lat],
						[geoUser.lng, geoUser.lat]
					],
					'snap_preventions': [
						'motorway',
						'ferry',
						'tunnel'
					],
					'details': [
						'road_class',
						'surface'
					],
					'profile': 'car',
					'locale': 'fr',
					'instructions': true,
					'calc_points': true,
					'points_encoded': false
				})
			});

			const r = await req.json() as RouteResponse;
			const points = r.paths[0].points as Point & string

			const milliseconds = r.paths[0].time;
			let seconds = Math.floor(milliseconds / 1000);
			const totalMinutes = Math.floor(milliseconds / (1000 * 60));

			const hours = Math.floor(totalMinutes / 60);
			const minutes = totalMinutes % 60;

			const formattedHours = String(hours).padStart(1, '0');
			const formattedMinutes = String(minutes).padStart(1, '0');

			const countdown = () => {
				if (seconds > 0) {
					const minutes = Math.floor((seconds % 3600) / 60);
					const remainingSeconds = seconds % 60;

					timeout = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

					seconds--;
				} else {
					clearInterval(interval);
				}
			}

			const interval = setInterval(countdown, 1000);

			if (formattedHours === '0') {
				timeRoute = `${formattedMinutes} minutes`;
			} else {
				timeRoute = `${formattedHours}:${formattedMinutes}`;
			}

			const markerContent = document.createElement('div');
			markerContent.innerHTML = mapDeliveryMarker();

			const markerDeliveryman = new Marker({ element: markerContent }).setLngLat([geoDeliveryman.lng, geoDeliveryman.lat]).addTo(map);

			let index = 0;
			const route = points.coordinates;
			const traceCoordinates: number[][] = [];

			const animateMarker = () => {
				if (index < route.length) {
					markerDeliveryman.setLngLat(route[index] as [number, number]);
					traceCoordinates.push(route[index]);

					(map.getSource('trace') as GeoJSONSource).setData({
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: traceCoordinates
						}
					});

					index++;

					setTimeout(() => requestAnimationFrame(animateMarker), 1000 / 10);
				} else {
					markerContent.classList.add('animate-finish');
					timeout = undefined;
					clearInterval(interval);
				}
			}

			map.on('load', () => {
				map.addSource('points', {
					'type': 'geojson',
					'data': geojson
				});

				map.addSource('route', {
					'type': 'geojson',
					'data': {
						'type': 'Feature',
						'properties': {},
						'geometry': {
							'type': 'LineString',
							'coordinates': route
						}
					}
				});

				map.addLayer({
					'id': 'route',
					'type': 'line',
					'source': 'route',
					'layout': {
						'line-join': 'round',
						'line-cap': 'round'
					},
					'paint': {
						'line-color': '#1e293b',
						'line-width': 4
					}
				});

				map.addSource('trace', {
					'type': 'geojson',
					'data': {
						'type': 'Feature',
						'properties': {},
						'geometry': {
							'type': 'LineString',
							'coordinates': []
						}
					}
				});

				map.addLayer({
					'id': 'trace',
					'type': 'line',
					'source': 'trace',
					'layout': {
						'line-join': 'round',
						'line-cap': 'round'
					},
					'paint': {
						'line-color': '#db2777',
						'line-width': 4
					}
				});

				animateMarker();
			});
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		await trackStart();
	});

	onDestroy(() => {
		map && map.remove();
	});
</script>

<div class="flex gap-2 py-1.5 px-3 text-slate-800 font-semibold text-base absolute top-0 z-10 backdrop-blur rounded-br-2xl">
	{#if timeRoute}
		<p>Temps estimé : { timeRoute }</p>
	{/if}
	{#if timeout}
		<span>•</span>
		<p>{ timeout }</p>
	{/if}
</div>
<div class="sm:map-wrap h-[30rem]">
	<div class="absolute w-full h-full" bind:this={mapContainer}/>
</div>
