import { Map } from '@maptiler/sdk';

export const textMarker = (text: string, isCustomer: boolean) => {
	const el = document.createElement('div');
	el.className = 'marker';

	const textEl = document.createElement('div');
	textEl.className = 'marker-text';
	textEl.textContent = text;
	textEl.style.position = 'relative';
	textEl.style.top = '-4rem';
	textEl.style.color = isCustomer ? '#db2777' : '#1e293b';
	textEl.style.textShadow = '0 0 2px #fff';
	textEl.style.fontFamily = 'Quicksand';
	textEl.style.fontSize = '1rem';
	textEl.style.fontWeight = '700';
	textEl.style.whiteSpace = 'nowrap';
	textEl.style.opacity = '.85';
	textEl.style.background = '#fff';
	textEl.style.boxShadow = '-4px 2px 10px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
	textEl.style.padding = '.3rem .5rem';
	textEl.style.borderRadius = '10px';

	el.appendChild(textEl);

	return el;
}

export const convertMsToDate = (milliseconds: number) => {
	const total_seconds = Math.floor(milliseconds / 1000);
	const total_minutes = Math.floor(total_seconds / 60);

	const seconds = (total_seconds % 60).toString();
	const minutes = (total_minutes % 60).toString();

	return { m: minutes, s: seconds };
}

export const addSource = (map: Map, id: string, coords: number[][]) => {
	return map.addSource(id, {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'LineString',
				'coordinates': coords
			}
		}
	});
}

export const addLayer = (map: Map, id: string, type: 'line' | 'geojson', lineColor: string) => {
	switch (type) {
		case 'line':
			return map.addLayer({
				'id': id,
				'type': 'line',
				'source': id,
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': lineColor,
					'line-width': 4
				}
			});
		case 'geojson':

	}
}
