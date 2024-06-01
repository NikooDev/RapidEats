import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth';
import { applyAction, deserialize } from '$app/forms';
import { setAuth } from '$lib/stores/auth';
import { invalidateAll } from '$app/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { RoleEnum } from '$lib/interfaces/user';
import { auth, db } from '$lib/firebase/app';
import { toastInfo, toastSuccess } from '$lib/config/toast';
import { pageLoading } from '$lib/stores/app';
import type { ActionResult } from '@sveltejs/kit';
import type { ModalStore, ToastStore } from '@skeletonlabs/skeleton';
import type { AuthType, RegisterType } from '$lib/interfaces/auth';

export const register = async (event: Event, data: RegisterType & AuthType, toast: ToastStore, modal: ModalStore) => {
	const form = event.target as HTMLFormElement;
	let loading = true;

	createUserWithEmailAndPassword(auth, data.email, data.password).then(async ({ user }) => {
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
				const docUsers = doc(db, 'users', user.uid);

				try {
					await setDoc(docUsers, {
						address: data.address,
						created: new Date(),
						email: data.email,
						firstname: data.firstname,
						lastname: data.lastname,
						latitude: data.latitude,
						longitude: data.longitude,
						phone: data.phone,
						role: RoleEnum.CUSTOMER,
						uid: user.uid,
						tuto: true,
						orders: [],
						updated: new Date(),
					});
				} catch (error) {
					console.error('Erreur lors de la création de l\'utilisateur dans Firestore : ', error);
				}

				setAuth({
					isLogged: true,
					token: token,
					expired: false
				});

				modal.close();
				await applyAction(result);
				await invalidateAll();
				pageLoading.set(false);
				loading = false;
				setTimeout(() => toast.trigger({ ...toastSuccess, message: 'Bienvenue !\n\nVotre inscription a été confirmée avec succès.\nVous êtes maintenant connecté.', autohide: true, hideDismiss: true, timeout: 5000 }), 200);
				break;
		}
	}).catch((err) => {
		loading = false;
		console.log(err);
	})

	return loading;
}

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
			pageLoading.set(false);
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
			pageLoading.set(false);
			setTimeout(() => toast.trigger({ ...toastInfo, message: 'Vous êtes déconnecté.', autohide: true, hideDismiss: true }), 200);
	}
}
