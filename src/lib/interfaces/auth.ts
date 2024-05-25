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
