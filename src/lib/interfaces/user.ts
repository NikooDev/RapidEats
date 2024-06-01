import type { Timestamp } from 'firebase/firestore'
import { OrderType } from '$lib/interfaces/order';
import MenuType from '$lib/interfaces/menu';

export enum RoleEnum {
	CUSTOMER = 'customer',
	RESTAURANT = 'restaurant',
	DELIVERYMAN = 'deliveryman'
}

export enum StatusEnum {
	AVAILABLE = 'available',
	ON_DELIVERY = 'on_delivery',
	UNAVAILABLE = 'unavailable'
}

type FoodType = 'pizza' | 'burger' | 'asiatique' | 'salade' | 'restaurant'

interface UserType {
	uid: string
	email: string
	phone: string
	role: RoleEnum
	latitude: string
	longitude: string
	tuto: boolean
	admin: boolean
	created: Date | Timestamp
	updated: Date | Timestamp
}

export interface AddressType {
	street: string
	postalCode: string
	city: string
}

export interface CustomerType extends UserType {
	lastname: string
	firstname: string
	address: AddressType
	orders?: string[]
}

export interface RestaurantType extends UserType {
	title: string
	description: string
	type: FoodType
	coverURL: string
	note: number
	slug: string
	address: AddressType
	menus?: MenuType[]
	orders?: OrderType[]
}

export interface DeliverymanType extends UserType {
	firstname: string
	status: StatusEnum,
	orders?: OrderType[]
}

export interface PointsCustomerDeliverymanType {
	lat: number
	lng: number
}

export type UsersType = CustomerType & RestaurantType & DeliverymanType;
