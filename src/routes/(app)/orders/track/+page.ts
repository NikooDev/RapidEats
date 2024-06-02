import type { PageLoad } from './$types';
import { getOrder } from '$lib/firebase/client';
import { goto } from '$app/navigation';
import { initializeSnapshotOrder, orderStore } from '$lib/stores/order';

export const load: PageLoad = async ({ url, parent }) => {
	const orderRef = url.searchParams.get('order')
	const { user } = await parent();

	try {
		if (orderRef) {
			const order = await getOrder(user.uid, orderRef, true);

			if (!order) {
				await goto('/?redirect=notfound');
			}

			if (user.uid && order) {
				initializeSnapshotOrder(user.uid, order.uid);
			}

			orderStore.set(order);

			return {
				order
			}
		} else {
			await goto('/?redirect=notfound');
		}
	} catch (err) {
		console.log(err);
	}
}
