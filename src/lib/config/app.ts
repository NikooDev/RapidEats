import { SettingsType } from '$lib/interfaces/app';

/**
 * @description Tableau des routes protégées
 */
export const protectedRoutes = [
	'/account',
	'/orders',
	'/track'
];

/**
 * @description Expiration de la session (15 jours)
 */
export const expireSession = 2 * 7 * 24 * 60 * 60 * 1000;

/**
 * @description Key de l'API MapTiler
 */
export const keyMapTiler = 'BDnu8t7usofNcbcmeIBe';

/**
 * @description Key de l'API GraphHopper
 */
export const keyGraphHopper = '4df65d10-6fac-429c-b8c5-1f2a5faa9f7f';

/**
 * Paramètres de l'application
 */
export const appSettings = {
	maps: true
} as SettingsType
