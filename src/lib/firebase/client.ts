import { collection, query, where, getDocs } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { db } from '$lib/firebase/app';
import type { RestaurantType } from '$lib/interfaces/user';
import type MenuType from '$lib/interfaces/menu';
import type DisheType from '$lib/interfaces/dishe';

export let searchStore = writable<RestaurantType[]>();
export let searchMenuStore = writable<MenuType[]>();
export let searchDisheStore = writable<DisheType[]>();
export let loadingStore = writable<boolean>(false);

export const getSearchDatas = async (event: KeyboardEvent) => {
	const target = event.target as HTMLInputElement;
	const value = target.value;

	const letterRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/;

	if (event.code.startsWith('Arrow')) {
		return;
	}

	if (value.trim().length === 0) {
		searchStore.set(null);
		searchMenuStore.set(null);
		searchDisheStore.set(null);
		loadingStore.set(false);
	} else if (value.trim().length > 1 && letterRegex.test(value.trim())) {
		try {
			loadingStore.set(true);

			const q = query(collection(db, 'users'), where('role', '==', 'restaurant'));
			const snapshot = await getDocs(q);
			const restaurants = snapshot.docs
				.filter(doc => doc.data().title.toLowerCase().includes(value.toLowerCase()))
				.map(doc => ({ ...doc.data() as RestaurantType }));

			const menus = snapshot.docs
				.flatMap(doc => doc.data().menus)
				.filter(menu => menu.title.toLowerCase().includes(value.toLowerCase()))
				.map(menu => ({ ...menu as MenuType }));

			const dishes = snapshot.docs
				.flatMap(doc => doc.data().dishes)
				.filter(dishe => dishe.title.toLowerCase().includes(value.toLowerCase()))
				.map(dishe => ({ ...dishe as DisheType }));

			setTimeout(() => loadingStore.set(false), 500);

			searchStore.set(restaurants);
			searchMenuStore.set(menus);
			searchDisheStore.set(dishes);
		} catch (err) {
			console.error('Error fetching documents: ', err);
		}
	} else {
		loadingStore.set(false);
		searchStore.set(null);
		searchMenuStore.set(null);
		searchDisheStore.set(null);
	}
}
