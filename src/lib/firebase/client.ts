import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import { setDeliveryman } from '$lib/stores/user';
import { db } from '$lib/firebase/app';
import {
	CustomerType,
	type DeliverymanType,
	type RestaurantType,
	RoleEnum,
	StatusEnum,
	type UsersType
} from '$lib/interfaces/user';
import type MenuType from '$lib/interfaces/menu';
import { OrderEnum, type OrderType } from '$lib/interfaces/order';

export let searchStore = writable<RestaurantType[]>();
export let searchMenuStore = writable<MenuType[] & { restaurantUID?: string, restaurantTitle?: string }>();
export let loadingStore = writable<boolean>(false);

/**
 * @description Formulaire de recherche
 * => Récupération des restaurants et de ses menus
 * => Filtrage sur les titres
 * @param event
 */
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
		loadingStore.set(false);
	} else if (value.trim().length > 1 && letterRegex.test(value.trim())) {
		try {
			loadingStore.set(true);

			const q = query(collection(db, 'users'), where('role', '==', 'restaurant'));
			const snapshot = await getDocs(q);
			const restaurants = snapshot.docs
				.filter(doc => doc.data().title.toLowerCase().includes(value.toLowerCase()))
				.map(doc => ({...doc.data() as RestaurantType}));

			const menus = snapshot.docs.flatMap(doc => {
				const restaurantData = doc.data();
				const restaurantUID = doc.id;
				const restaurantTitle = restaurantData.title; // Assurez-vous que vous avez la bonne clé pour le titre du restaurant

				return restaurantData.menus.map((menu: MenuType) => ({
					...menu,
					restaurantUID,
					restaurantTitle
				}));
			}).filter(menu => menu.title.toLowerCase().includes(value.toLowerCase())).map(menu => ({...menu as MenuType}));

			setTimeout(() => loadingStore.set(false), 500);

			searchStore.set(restaurants);
			searchMenuStore.set(menus);
		} catch (err) {
			console.error('Error fetching restaurants with searchbox: ', err);
		}
	} else {
		loadingStore.set(false);
		searchStore.set(null);
		searchMenuStore.set(null);
	}
};

/**
 * @description Pour le rôle Admin
 * => Récupération de tous les clients
 */
export const getCustomers = async () => {
	const q = query(collection(db, 'users'), where('role', '==', 'customer'));
	const snapshot = await getDocs(q);

	return snapshot.docs
		.map(doc => ({...doc.data() as CustomerType}));
}

/**
 * @description Modification du profil
 * => Si modification avec subCollection et ref,
 * il faut s'assurer d'avoir les mêmes infos dans les deux collections
 * @param user
 * @param subUID
 * @param subUser
 * @param subCollection
 * @param ref
 */
export const setProfile = async <T>({ ...user }: Partial<UsersType>, subUID?: string, subUser?: T, subCollection?: string, ref?: string) => {
	try {
		const userDocRef = doc(db, 'users', user.uid);

		await setDoc(userDocRef, user, { merge: true });

		if (subUID && subUser && subCollection && ref) {
			const subUserDocRef = doc(db, 'users', subUID, subCollection, ref);

			await setDoc(subUserDocRef, subUser, { merge: true });
		}
	} catch (err) {
		console.log(err);
	}
}

/**
 * @description Récupération de la position d'un restaurant
 * @param restaurantUID
 */
export const getPositionRestaurant = async (restaurantUID: string): Promise<{ latitude: string, longitude: string }> => {
	const q = query(
		collection(db, 'users'),
		where('role', '==', 'restaurant'),
		where('uid', '==', restaurantUID)
	);
	const snapshot = await getDocs(q);

	const restaurants = snapshot.docs
		.map(doc => ({...doc.data() as RestaurantType}));

	return {
		latitude: restaurants[0].latitude,
		longitude: restaurants[0].longitude
	}
}

/**
 * @description Ajoute le contenu du panier en commande
 * => Ajoute sa référence dans le tableau order[] de l'utilisateur
 * @param uid
 * @param role
 * @param order
 */
export const addOrders = async (uid: string, role: RoleEnum, { ...order }: OrderType) => {
	if (role === RoleEnum.CUSTOMER) {
		try {
			const ordersRef = collection(db, `users/${uid}/orders`);
			const docRef = await addDoc(ordersRef, order);
			const docId = docRef.id;
			const orderWithId = { ...order, uid: docId };

			const userDocRef = doc(db, 'users', uid);

			await setDoc(docRef, orderWithId, { merge: true });
			await setDoc(userDocRef, {
				orders: arrayUnion(docId)
			}, { merge: true });
		} catch (err) {
			console.log(err);
		}
	}
}

/**
 * @description Récupération d'une commande selon sa référence
 * @param userUID
 * @param orderRef
 * @param delivered
 */
export const getOrder = async (userUID: string, orderRef: string, delivered?: boolean) => {
	try {
		const orderDocRef = doc(db, 'users', userUID, 'orders', orderRef);
		const orderDocSnap = await getDoc(orderDocRef);

		if (orderDocSnap.exists()) {
			const order = orderDocSnap.data() as OrderType;

			if (delivered && order.status !== OrderEnum.IN_DELIVERY) {
				return null;
			}

			return { uid: orderDocSnap.id, ...order };
		} else {
			return null;
		}
	} catch (error) {
		console.error('Erreur lors de la récupération de la sous-collection:', error);
	}
}

export const setOrder = async (userUID: string, orderRef: string, { ...order }: OrderType) => {
	try {
		const orderDocRef = doc(db, 'users', userUID, 'orders', orderRef);

		await setDoc(orderDocRef, order, { merge: true });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du document:', error);
	}
}

/**
 * @description Annulation d'une commande
 * @param userUID
 * @param orderRef
 */
export const cancelOrder = async (userUID: string, orderRef: string) => {
	const parentDocRef = doc(db, 'users', userUID);
	const subcollectionRef = collection(parentDocRef, 'orders');
	const documentRef = doc(subcollectionRef, orderRef);

	try {
		await updateDoc(parentDocRef, {
			orders: arrayRemove(orderRef)
		}).then(async () => {
			await deleteDoc(documentRef);
		});
	} catch (error) {
		console.error('Erreur lors de la suppression de la commande: ', error);
	}
}

/**
 * @description Lorsque qu'un client à confirmer sa commande
 * => Recherche d'un livreur toutes les secondes
 * => Modification du statut du livreur
 * => Ajout du livreur à la commande
 * @param userUID
 * @param orderRef
 */
export const confirmOrder = async (userUID: string, orderRef: OrderType) => {
	const findDeliveryman = async (): Promise<boolean> => {
		const q = query(
			collection(db, 'users'),
			where('role', '==', 'deliveryman'),
			where('status', '==', StatusEnum.AVAILABLE)
		);

		const snapshot = await getDocs(q);

		if (!snapshot.empty) {
			const deliveryman = snapshot.docs.map(doc => ({ ...doc.data() as DeliverymanType }));

			const randomIndex = Math.floor(Math.random() * deliveryman.length);
			const chosenDeliveryman = deliveryman[randomIndex];

			setDeliveryman(chosenDeliveryman);

			const deliveryDocRef = doc(db, 'users', chosenDeliveryman.uid);
			const orderDocRef = doc(db, 'users', userUID, 'orders', orderRef.uid);

			await setDoc(deliveryDocRef, { status: StatusEnum.ON_DELIVERY }, { merge: true });

			delete chosenDeliveryman.orders;

			await setDoc(orderDocRef, {
				status: OrderEnum.IN_DELIVERY,
				deliveryman: chosenDeliveryman
			}, { merge: true });

			return true;
		} else {
			return false;
		}
	};

	/**
	 * @description Toutes les secondes
	 * => findDeliveryman() est rééxécutée si aucun livreur n'est disponible
	 */
	const checkAvailability = async (): Promise<boolean> => {
		const result = await findDeliveryman();
		if (result) {
			return true;
		} else {
			return new Promise((resolve) => {
				setTimeout(async () => {
					const nextResult = await checkAvailability();
					resolve(nextResult);
				}, 3000);
			});
		}
	};

	try {
		return await checkAvailability();
	} catch (error) {
		console.error("Error confirming order:", error);
		return false;
	}
}

/**
 * @description Récupération des commandes terminées
 * @param userUID
 */
export const getDeliveredOrders = async (userUID: string) => {
	const q = query(
		collection(db, 'users', userUID, 'orders'), where('status', '==', OrderEnum.DELIVERED)
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map(doc => ({...doc.data() as OrderType}));
}
