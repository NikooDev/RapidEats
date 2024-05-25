import { expireSession } from '$lib/config/app';
import { adminAuth } from '$lib/firebase/server/admin';

export const createSession = async (token: string) => {
	const expiresIn = expireSession;
	const options = {
		maxAge: expiresIn,
		httpOnly: true,
		secure: true,
		path: '/'
	};

	const sessionCookie = await adminAuth.createSessionCookie(token, {
		expiresIn
	});

	return { sessionCookie, options };
};

export const verifyToken = async (token: string | undefined) => {
	if (!token || token === 'null' || token === 'undefined') return null;

	return adminAuth.verifySessionCookie(token);
};
