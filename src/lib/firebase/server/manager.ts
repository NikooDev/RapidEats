import { admindB } from '$lib/firebase/server/admin';
import { Timestamp, where } from 'firebase/firestore';
import { error } from '@sveltejs/kit';
import { FirebaseError } from 'firebase-admin';
import { DeliverymanType, RestaurantType, RoleEnum, UsersType } from '$lib/interfaces/user';

type QuerySnap = FirebaseFirestore.QuerySnapshot<
	FirebaseFirestore.DocumentData,
	FirebaseFirestore.DocumentData
>;

export const getCurrentUser = async (uid: string) => {
	let userSnapshot: QuerySnap;

	if (!uid) {
		return {
			user: null
		}
	}

	try {
		userSnapshot = await admindB
			.collection('users')
			.where('uid', '==', uid)
			.get();
	} catch (err) {
		console.error(err);
		const fbe = err as FirebaseError;
		error(500, fbe.message);
	}

	const currentUser = snapToData<UsersType>(userSnapshot);

	currentUser.map((user) => {
		switch (user.role) {
			case RoleEnum.RESTAURANT:
				user.firstname = 'restaurant';
				user.lastname = user.title;
				break;
		}

		return user;
	});

	return {
		user: currentUser[0]
	};
}

export const getRestaurants = async () => {
	let restaurantSnapshot: QuerySnap;

	try {
		restaurantSnapshot = await admindB
			.collection('users').orderBy('created', 'asc')
			.where('role', '==', 'restaurant')
			.get();
	} catch (err) {
		console.error(err);
		const fbe = err as FirebaseError;
		error(500, fbe.message);
	}

	const restaurants = snapToData<RestaurantType>(restaurantSnapshot);

	return {
		restaurants
	};
}

export const getRestaurant = async (slug: string) => {
	let restaurantSnapshot: QuerySnap;

	try {
		restaurantSnapshot = await admindB
			.collection('users')
			.where('role', '==', 'restaurant')
			.where('slug', '==', slug)
			.get();
	} catch (err) {
		console.error(err);
		const fbe = err as FirebaseError;
		error(500, fbe.message);
	}

	const restaurants = snapToData<RestaurantType>(restaurantSnapshot);

	return {
		restaurant: restaurants[0]
	};
}

export const getDeliverymans = async () => {
	let deliverymanSnapshot: QuerySnap;

	try {
		deliverymanSnapshot = await admindB
			.collection('users')
			.where('role', '==', 'deliveryman')
			.get();
	} catch (err) {
		console.error(err);
		const fbe = err as FirebaseError;
		error(500, fbe.message);
	}

	const deliveryman = snapToData<DeliverymanType>(deliverymanSnapshot);

	return {
		deliveryman
	};
}

export const snapToData = <T>(
	q: QuerySnap
) => {
	if (q.empty) {
		return [];
	}
	return q.docs.map((doc) => {
		const data = doc.data();
		const created = data.created as Timestamp;
		const updated = data.updated as Timestamp;

		return {
			...data,
			created: created.toDate(),
			updated: updated.toDate()
		}
	}) as T[];
}
