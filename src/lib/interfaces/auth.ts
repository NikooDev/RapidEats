import { DecodedIdToken } from 'firebase-admin/auth';
import { AddressType } from '$lib/interfaces/user';

export interface AuthType {
	email: string
	password: string
}

export interface RegisterType {
	address: AddressType
	firstname: string
	lastname: string
	email: string
	password: string
	confirmation: string
	phone: string
	longitude: string
	latitude: string
}

export interface AuthUser {
	token: DecodedIdToken | null | undefined | string
	isLogged: boolean
	expired: boolean
}

export interface SuggestionsAddressType {
	street: string,
	postalCode: string,
	city: string,
	longitude: string,
	latitude: string
}
