import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { initializeSnapshotOrder } from '$lib/stores/order';

export const ssr = false;

export const load: LayoutLoad = async ({ parent }) => {
	if (browser) {
		try {
			const data = await parent();
			data && data.user && initializeSnapshotOrder(data.user.uid);
		}	catch (err) {
			console.error(err);
		}
	}
}
