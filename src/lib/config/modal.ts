import type { ModalSettings, ModalStore } from '@skeletonlabs/skeleton';
import { browser } from '$app/environment';
import { useSettingsStore } from '$lib/stores/app';

export const modalLogin: ModalSettings = {
	type: 'component',
	component: 'modalLogin',
	backdropClasses: 'w-screen'
};

export const modalSignup: ModalSettings = {
	type: 'component',
	component: 'modalSignup',
	backdropClasses: 'w-screen'
};

export const modalMenu: ModalSettings = {
	type: 'component',
	component: 'modalMenu',
	backdropClasses: 'w-screen'
};

export const subscribeModal = (modalStore: ModalStore) => {
	const { settingsStore } = useSettingsStore();

	return modalStore.subscribe(value => {
		settingsStore.update(settings => ({ ...settings, overlay: !!value[0] }));

		if (browser) {
			if (value[0]) {
				document.body.style.overflowY = 'hidden';
			} else {
				document.body.style.overflowY = 'scroll';
			}
		}
	});
}
