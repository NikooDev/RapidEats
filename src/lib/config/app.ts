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
 * Paramètres de l'application
 */
export const appSettings = {
	maps: true
} as SettingsType
