import { writable } from 'svelte/store';
import MenuType from '$lib/interfaces/menu';

export const cart = writable<MenuType[] & { quantity: number }>();
