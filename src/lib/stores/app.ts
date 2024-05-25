import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { appSettings } from '$lib/config/app';
import type { SettingsType } from '$lib/interfaces/app';

/**
 * Store général de l'application (paramètres)
 */
const settings = browser && JSON.parse(localStorage.getItem('settings')) as SettingsType;

if (!settings) {
	browser && localStorage.setItem('settings', JSON.stringify(appSettings));
}

const settingsStore = writable<SettingsType>({
	maps: settings ? settings.maps : true,
	overlay: false
});

export const useSettingsStore = () => {
	return {
		settingsStore
	}
}

export default settingsStore;
