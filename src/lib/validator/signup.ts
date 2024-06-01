import { toastError } from '$lib/config/toast';
import type { RegisterType } from '$lib/interfaces/auth';
import type{ ToastStore } from '@skeletonlabs/skeleton';

export const validateStep1Signup = (data: RegisterType, toast: ToastStore) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

	if (data.lastname.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre nom est requis', hideDismiss: true });
		return false;
	}
	if (data.firstname.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre prénom est requis', hideDismiss: true });
		return false;
	}
	if (data.email.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre adresse e-mail est requise', hideDismiss: true });
		return false;
	}
	if (!emailRegex.test(data.email)) {
		toast.trigger({ ...toastError, message: 'Votre adresse e-mail est invalide', hideDismiss: true });
		return false;
	}
	if (data.password.trim() === '') {
		toast.trigger({ ...toastError, message: 'Vous devez choisir un mot de passe', hideDismiss: true });
		return false;
	}
	if (data.password.length < 6 || data.password.length > 30) {
		toast.trigger({ ...toastError, message: 'Votre mot de passe doit comporter entre 6 et 30 caractères', hideDismiss: true });
		return false;
	}
	if (data.confirmation.trim() === '') {
		toast.trigger({ ...toastError, message: 'Vous devez confirmer votre mot de passe', hideDismiss: true });
		return false;
	}
	if (data.password !== data.confirmation) {
		toast.trigger({ ...toastError, message: 'Les mots de passe ne correspondent pas', hideDismiss: true });
		return false;
	}

	return true
}

export const validateStep2Signup = (data: RegisterType, toast: ToastStore) => {
	if (data.address.street.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre adresse est requise', hideDismiss: true });
		return false;
	}
	if (data.address.postalCode.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre code postal est requis', hideDismiss: true });
		return false;
	}
	if (data.address.city.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre ville est requise', hideDismiss: true });
		return false;
	}
	if (data.phone.trim() === '') {
		toast.trigger({ ...toastError, message: 'Votre numéro de téléphone est requis', hideDismiss: true });
		return false;
	}
	if (data.phone.length !== 10) {
		toast.trigger({ ...toastError, message: 'Votre numéro de téléphone est invalide', hideDismiss: true });
		return false;
	}

	return true;
}
