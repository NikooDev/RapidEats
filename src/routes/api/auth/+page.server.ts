import { type Actions, error, redirect } from '@sveltejs/kit';
import { createSession } from '$lib/firebase/server/session';

export const actions = {
	signup: async ({ request, cookies }) => {
		const {token} = Object.fromEntries(
			await request.formData()
		);

		if (!token || typeof token !== 'string') {
			error(401, 'Unauthorized request!');
		}

		const {
			sessionCookie,
			options,
		} = await createSession(token);

		cookies.set('user', sessionCookie, options);

		redirect(303, '/');
	},
	login: async ({ request, cookies }) => {
		const {token} = Object.fromEntries(
			await request.formData()
		);

		if (!token || typeof token !== 'string') {
			error(401, 'Unauthorized request!');
		}

		const {
			sessionCookie,
			options,
		} = await createSession(token);

		cookies.set('user', sessionCookie, options);

		redirect(303, '/');
	},
	logout: async ({ cookies }) => {
		cookies.delete('user', { path: '/' });

		redirect(303, '/');
	}
} satisfies Actions;
