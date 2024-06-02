import type { PageServerLoad } from './$types';
import { getRestaurant } from '$lib/firebase/server/manager';

export const load: PageServerLoad = async ({ params }) => {
	return await getRestaurant(params.slug);
}
