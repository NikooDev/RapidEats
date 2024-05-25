import { writable } from 'svelte/store';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/app';
import type { DeliverymanType, RestaurantType, UsersType } from '$lib/interfaces/user';

/**
 * Store des utilisateurs :
 * - Utilisateur connecté (customers, restaurants, livreurs)
 * - Liste des restaurants
 * - Liste des livreurs
 */

const userStore = writable<UsersType>();
const restaurantStore = writable<RestaurantType[]>();
const deliverymanStore = writable<DeliverymanType[]>();

export function setUser(data: UsersType) {
	userStore.set(data);
}

export function setRestaurant(data: RestaurantType[]) {
	restaurantStore.set(data);
}

export function setDeliveryman(data: DeliverymanType[]) {
	deliverymanStore.set(data);
}

/**
 * Écouteurs Firestore
 * Si des données sont modifiées, elles seront transmises en temps réel dans le store
 * @param userUID
 */
export const initializeSnapshot = (userUID: string | null) => {
	if (userUID) {
		const queryUser = query(
			collection(db, 'users'), where('uid', '==', userUID)
		);
		onSnapshot(queryUser, (snapshot) => {
			const users = snapshot.docs.map(doc => ({ ...doc.data() as UsersType }));
			userStore.set(users[0]);
		});
	}

	const queryRestaurant = query(
		collection(db, 'users'), where('role', '==', 'restaurant'), orderBy('created', 'asc')
	);
	onSnapshot(queryRestaurant, (snapshot) => {
		const restaurants = snapshot.docs.map(doc => ({ ...doc.data() as RestaurantType }));

		restaurantStore.set(restaurants);
	});

	const queryDeliveryman = query(
		collection(db, 'users'), where('role', '==', 'deliveryman')
	);
	onSnapshot(queryDeliveryman, (snapshot) => {
		const deliverymans = snapshot.docs.map(doc => ({ ...doc.data() as DeliverymanType }));
		deliverymanStore.set(deliverymans);
	});
}

export const useUsersStore = () => {
	return {
		userStore,
		restaurantStore,
		deliverymanStore
	};
}
