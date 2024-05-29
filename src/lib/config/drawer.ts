import type { DrawerSettings, DrawerStore } from '@skeletonlabs/skeleton';
import { useSettingsStore } from '$lib/stores/app';

const drawer = {
	bgDrawer: 'bg-white',
	rounded: 'rounded-2xl',
	shadow: 'shadow-md',
	duration: 300,
	regionDrawer: 'px-4'
};

export const drawerLeft: DrawerSettings = {
	...drawer,
	id: 'navigation',
	position: 'left',
	regionBackdrop: 'top-0 left-0 bottom-0 m-3',
	width: 'w-72'
};

export const drawerRight: DrawerSettings = {
	...drawer,
	id: 'cart',
	position: 'right',
	width: 'w-96',
	regionBackdrop: 'top-0 right-0 bottom-0 m-3'
};

export const subscribeDrawer = (drawerStore: DrawerStore) => {
	const { settingsStore } = useSettingsStore();

	return drawerStore.subscribe((drawer) => {
		settingsStore.update(settings => ({ ...settings, overlay: !!drawer.open }));
	});
}
