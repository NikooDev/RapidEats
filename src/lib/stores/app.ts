import { Writable, writable } from 'svelte/store';
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

export const pageLoading = writable(false);

export const fromLocalStorage = (storageKey: string, fallbackValue: any) => {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey)

		if (storedValue !== 'undefined' && storedValue !== null) {
			return (typeof fallbackValue === 'object')
				? JSON.parse(storedValue)
				: storedValue
		}
	}

	return fallbackValue
}

export const toLocalStorage = <T>(store: Writable<T>, storageKey: string) => {
	if (browser) {
		store.subscribe(value => {
			let storageValue = (typeof value === 'object')
				? JSON.stringify(value) as string
				: value as T

			window.localStorage.setItem(storageKey, storageValue as string);
		})
	}
}

export default settingsStore;
