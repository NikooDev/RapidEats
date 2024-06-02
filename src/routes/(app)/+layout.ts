import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { initializeSnapshotOrders } from '$lib/stores/order';

export const ssr = false;

export const load: LayoutLoad = async ({ parent, url }) => {
	if (browser) {
		try {
			const data = await parent();
			data && data.user && initializeSnapshotOrders(data.user.uid);
		}	catch (err) {
			console.error(err);
		}
	}
}
