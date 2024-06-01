import { DeliverymanType } from '$lib/interfaces/user';
import type { Timestamp } from 'firebase/firestore';

export enum OrderEnum {
	PENDING = 'pending',
	IN_DELIVERY = 'in_delivery',
	DELIVERED = 'delivered'
}

export interface OrderGrouped {
	restaurantTitle: string;
	restaurantUID: string;
	items: {
		title: string;
		uid: string;
		price: number;
		restaurantUID: string;
		quantity: number;
	}[];
}

export interface RestaurantOrderType {
	restaurantUID: string
	title: string
	latitude: string
	longitude: string
	menus: {
		uid: string
		title: string
		price: number
		quantity: number
	}[],
}

export interface OrderType {
	uid: string
	restaurants: RestaurantOrderType[]
	deliveryman?: DeliverymanType
	status: OrderEnum
	totalPrice: number
	created: Date & Timestamp
}

export interface CartMenuType {
	uid: string
	restaurantUID: string
	restaurantTitle: string
	title: string
	quantity: number
	price: number
	items: CartMenuType[];
}

export interface CartType {
	[uid: string]: CartMenuType;
}
