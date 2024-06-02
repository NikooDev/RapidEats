import type { PageLoad } from './$types';
import { RoleEnum, type UsersType } from '$lib/interfaces/user';
import { goto } from '$app/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/app';
import { setCustomers } from '$lib/stores/user';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	try {
		if (user && !user.admin) {
			await goto('/?redirect=notfound');
		}

		const q = query(
			collection(db, 'users'), where('role', '==', 'customer')
		)
		onSnapshot(q, (snapshot) => {
			const customer = snapshot.docs.map(doc => ({ ...doc.data() as UsersType }));

			setCustomers(customer.filter(c => c.role === RoleEnum.CUSTOMER));
		});
	} catch (err) {
		console.log(err);
	}
}
