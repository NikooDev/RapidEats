import { writable } from 'svelte/store';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { AuthUser } from '$lib/interfaces/auth';
import { auth } from '$lib/firebase/app';

/**
 * Store d'authentification :
 * - Utilisateur connecté
 */

const authStore = writable<AuthUser>();

export const setAuth = (data: AuthUser) => {
	authStore.set(data);
}

/**
 * Écouteurs Firestore
 * Si des données de l'authentification sont détectées, elles seront transmises en temps réel dans le store
 */
export const initializeAuthListeners = () => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			const token = await user.getIdToken();

			setAuth({
				isLogged: true,
				token: token,
				expired: false
			});
		} else {
			setAuth(null);
		}
	});

	onIdTokenChanged(auth, async (user) => {
		if (user) {
			const token = await user.getIdToken();

			setAuth({
				isLogged: true,
				token: token,
				expired: false
			});
		} else {
			setAuth(null);
		}
	});
}

export const useAuthStore = () => {
	return authStore;
}
