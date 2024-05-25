import { signInWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth';
import { applyAction, deserialize } from '$app/forms';
import { setAuth } from '$lib/stores/auth';
import { invalidateAll } from '$app/navigation';
import { auth } from '$lib/firebase/app';
import { toastInfo, toastSuccess } from '$lib/config/toast';
import type { ActionResult } from '@sveltejs/kit';
import type { ToastStore } from '@skeletonlabs/skeleton';

export const login = async (event: Event, { email, password }: { email: string, password: string }, toast: ToastStore) => {
	const form = event.target as HTMLFormElement;

	const login = await signInWithEmailAndPassword(auth, email, password);
	const { user }: UserCredential = login;

	const token = await user.getIdToken();

	const body = new FormData(form);
	body.append('token', token);

	const response = await fetch(form.action, {
		method: 'POST',
		body
	});

	const result: ActionResult = deserialize(
		await response.text()
	);

	switch (result.type) {
		case 'error':
			setAuth({
				isLogged: false,
				token: null,
				expired: false
			});
			await applyAction(result);
			console.error(result.error);
			break;
		case 'redirect':
			setAuth({
				isLogged: true,
				token: token,
				expired: false
			});
			await applyAction(result);
			await invalidateAll();
			setTimeout(() => toast.trigger({ ...toastSuccess, message: 'Vous êtes connecté.', autohide: true, hideDismiss: true }), 200);
			break;
	}
}

export const logout = async (event: Event, toast: ToastStore) => {
	const form = event.target as HTMLFormElement;

	await signOut(auth);

	const response = await fetch(form.action, {
		method: 'POST',
		body: new FormData(form)
	});

	const result: ActionResult = deserialize(
		await response.text()
	);

	switch (result.type) {
		case 'error':
			await applyAction(result);
			console.error(result.error);
			break;
		case 'redirect':
			await applyAction(result);
			await invalidateAll();
			setTimeout(() => toast.trigger({ ...toastInfo, message: 'Vous êtes déconnecté.', autohide: true, hideDismiss: true }), 200);
	}
}
