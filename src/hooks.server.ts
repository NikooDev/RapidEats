import { type Handle, redirect } from '@sveltejs/kit';
import { protectedRoutes } from '$lib/config/app';
import { verifyToken } from '$lib/firebase/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('user');
	const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route));

	try {
		const decodedToken = await verifyToken(token);

		if (decodedToken) {
			event.locals.auth = decodedToken;
		}

		if (isProtectedRoute) {
			if (!decodedToken) {
				event.cookies.delete('user', { path: '/' });
				redirect(302, '/');
			}
		}
	} catch (err) {
		event.cookies.delete('user', { path: '/' });
		redirect(302, '/');
	}

	return resolve(event);
};
