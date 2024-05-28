export const calculateDistance = (point1: { lat: number, lng: number }, point2: { lat: number, lng: number }) => {
	const earthRadius = 6371e3;
	const phi1 = toRadians(point1.lat);
	const phi2 = toRadians(point2.lat);
	const deltaPhi = toRadians(point2.lat - point1.lat);
	const deltaLambda = toRadians(point2.lng - point1.lng);

	const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
		Math.cos(phi1) * Math.cos(phi2) *
		Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return earthRadius * c;
}

export const calculateZoomLevel = (distance: number) => {
	const ZOOM_FACTOR = 1600 * 10000;

	return Math.max(1, Math.floor(Math.log2(ZOOM_FACTOR / distance)));
}

export const toRadians = (degrees: number) => {
	return degrees * Math.PI / 180;
}

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
	textEl.style.opacity = '.8';
	textEl.style.background = '#fff';
	textEl.style.boxShadow = '-4px 2px 10px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
	textEl.style.padding = '.3rem .5rem';
	textEl.style.borderRadius = '10px';

	el.appendChild(textEl);

	return el;
}
