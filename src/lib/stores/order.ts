import { writable } from 'svelte/store';
import { fromLocalStorage, toLocalStorage } from '$lib/stores/app';
import type { CartType } from '$lib/interfaces/order';
import { browser } from '$app/environment';

export const cartStore =
	writable<CartType>(fromLocalStorage('cart', {}));

toLocalStorage(cartStore, 'cart');

export const totalCart = writable(0);

if (browser) {
	cartStore.subscribe((cart) => {
		totalCart.set(Object.values(cart).reduce((total, item) => total + item.quantity, 0));
	});
}
