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
const restaurantsStore = writable<RestaurantType[]>();
const restaurantStore = writable<RestaurantType>();
const deliverymansStore = writable<DeliverymanType[]>();
const deliverymanStore = writable<DeliverymanType>();

export const setUser = (data: UsersType) => {
	userStore.set(data);
}

export const setRestaurants = (data: RestaurantType[]) => {
	restaurantsStore.set(data);
}

export const setRestaurant = (data: RestaurantType) => {
	restaurantStore.set(data);
}

export const setDeliverymans = (data: DeliverymanType[]) => {
	deliverymansStore.set(data);
}

export const setDeliveryman = (data: DeliverymanType) => {
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

		restaurantsStore.set(restaurants);
	});

	const queryDeliveryman = query(
		collection(db, 'users'), where('role', '==', 'deliveryman')
	);
	onSnapshot(queryDeliveryman, (snapshot) => {
		const deliverymans = snapshot.docs.map(doc => ({ ...doc.data() as DeliverymanType }));
		deliverymansStore.set(deliverymans);
	});
}

export const useUsersStore = () => {
	return {
		userStore,
		restaurantsStore,
		restaurantStore,
		deliverymansStore,
		deliverymanStore
	};
}
