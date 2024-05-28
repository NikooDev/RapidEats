import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthType {
	email: string
	password: string
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
	longitude: number,
	latitude: number
}
