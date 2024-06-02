import { writable } from 'svelte/store';
import { fromLocalStorage, toLocalStorage } from '$lib/stores/app';
import { type OrderType, type CartType, OrderEnum } from '$lib/interfaces/order';
import { browser } from '$app/environment';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase/app';
import { UsersType } from '$lib/interfaces/user';
import { setDeliveryman } from '$lib/stores/user';

export const cartStore =
	writable<CartType>(fromLocalStorage('cart', {}));

toLocalStorage(cartStore, 'cart');

export const ordersStore = writable<OrderType[]> ([]);
export const orderStore = writable<OrderType>();
export const ordersCount = writable<number>(0);
export const timeOut = writable<number>(0);

export const totalCart = writable(0);

if (browser) {
	cartStore.subscribe((cart) => {
		totalCart.set(Object.values(cart).reduce((total, item) => total + item.quantity, 0));
	});
}

export const initializeSnapshotOrders = (userUID: string) => {
	onSnapshot(doc(db, 'users', userUID), async (snapDoc) => {
		const userData = snapDoc.data() as UsersType;

		await Promise.all(userData.orders.map(async refOrder => {
			onSnapshot(doc(db, 'users', userUID, 'orders', refOrder), (snapshot) => {
				ordersStore.update((oldOrders) => {
					if (!Array.isArray(oldOrders)) {
						oldOrders = [];
					}

					const newOrder = snapshot.data() as OrderType;
					const orderIndex = oldOrders.findIndex(order => order.uid === refOrder);

					if (newOrder) {
						if (orderIndex !== -1) {
							oldOrders[orderIndex] = newOrder;
						} else {
							oldOrders.push(newOrder);
						}
					} else {
						if (orderIndex !== -1) {
							oldOrders.splice(orderIndex, 1);
						}
					}

					const ordersPendingInDelivery = oldOrders.filter((el) => el.status === OrderEnum.PENDING || el.status === OrderEnum.IN_DELIVERY).length;

					ordersCount.set(ordersPendingInDelivery);

					return [...oldOrders];
				});
			});
		}));
	});
}

export const initializeSnapshotOrder = (userUID: string, orderRef: string) => {
	onSnapshot(doc(db, 'users', userUID, 'orders', orderRef), (snapshot) => {
		const data = snapshot.data() as OrderType;

		orderStore.set(data);
		setDeliveryman(data.deliveryman);
	});
}
