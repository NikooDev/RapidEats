import initializeFirebase, { auth } from '$lib/firebase/app';
import { setUser, setRestaurant, setDeliveryman, initializeSnapshot } from '$lib/stores/user';
import { initializeAuthListeners, setAuth } from '$lib/stores/auth';
import { goto, invalidateAll } from '$app/navigation';
import { expireSession } from '$lib/config/app';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = ({ data }) => {
	if (browser) {
		try {
			initializeFirebase();
			initializeAuthListeners();
			initializeSnapshot((data && data.user) ? data.user.uid : null);
		}	catch (err) {
			console.error(err);
		}

		if (data) {
			if (data.auth && data.auth.uid) {
				const expirationTime = data.auth.auth_time * 1000 + expireSession;
				const currentTime = Date.now();

				setAuth({
					isLogged: true,
					token: data.auth,
					expired: false
				});

				if (currentTime >= expirationTime) {
					auth.signOut().then(async () => {
						await invalidateAll();
						await goto('/');
					});

					setAuth({
						isLogged: false,
						token: null,
						expired: true
					});
				} else {
					setTimeout(() => {
						auth.signOut().then(async () => {
							await invalidateAll();
							await goto('/');
						});

						setAuth({
							isLogged: false,
							token: null,
							expired: true
						});
					}, expirationTime - currentTime);
				}
			}

			setUser(data.user);
			setRestaurant(data.restaurants);
			setDeliveryman(data.deliveryman);
		}
	}

	return data;
}
