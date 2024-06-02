export const setPoints = (points: number[][]) => {
	return {
		'points': points,
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
	}
}
