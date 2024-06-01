import type { PageLoad } from './$types';
import { setRestaurant } from '$lib/stores/user';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ data }) => {
	if (data && data.restaurant) {
		setRestaurant(data.restaurant);
	} else {
		return await goto('/?redirect=notfound');
	}
}
