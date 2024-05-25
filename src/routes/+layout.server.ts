import { LayoutServerLoad } from './$types';
import { getCurrentUser, getDeliverymans, getRestaurants } from '$lib/firebase/server/manager';
import { expireSession } from '$lib/config/app';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { user } = await getCurrentUser(locals.auth?.uid);
	const { restaurants } = await getRestaurants();
	const { deliveryman } = await getDeliverymans();

	const authTime = locals.auth && locals.auth.auth_time * 1000;

	if (authTime) {
		const expirationTime = authTime + expireSession;
		const currentTime = Date.now();

		if (currentTime >= expirationTime) {
			cookies.delete('user', { path: '/' });

			return {
				auth: null,
				user,
				restaurants,
				deliveryman
			};
		}
	}

	return {
		auth: locals.auth,
		user,
		restaurants,
		deliveryman
	}
}
