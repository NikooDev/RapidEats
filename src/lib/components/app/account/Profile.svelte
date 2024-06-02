<script lang="ts">
	import { Icon, User } from '$lib/icons';
	import type { UsersType } from '$lib/interfaces/user';
	import Edit from '$lib/icons/Edit.svelte';
	import { writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import { setProfile } from '$lib/firebase/client';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { toastError, toastSuccess } from '$lib/config/toast';
	import { invalidate } from '$app/navigation';
	import { auth } from '$lib/firebase/app';
	import { updateEmail } from 'firebase/auth';

	export let users: UsersType;

	const usersStore = writable<UsersType>({ ...users });
	const fieldsEnabled = writable({
		firstname: true,
		lastname: true,
		email: true,
		phone: true
	});
	const initialValues = writable<UsersType>({ ...users });
	const toast = getToastStore();

	$: isFieldEmpty = false;
	$: isSameAsInitial = true;

	const resetField = () => {
		fieldsEnabled.set({
			firstname: true,
			lastname: true,
			email: true,
			phone: true
		});
	}

	const enableField = (field: keyof UsersType) => {
		fieldsEnabled.update(fields => {
			const updatedFields = {} as { [key in keyof UsersType]: boolean };
			Object.keys(fields).forEach(key => {
				updatedFields[key as keyof UsersType] = key !== field;
			});
			return updatedFields;
		});
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		const allowedKeys = [
			'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'
		];

		const target = event.target as HTMLInputElement;

		if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
			event.preventDefault();
		}

		if (target.value.length >= 10 && !allowedKeys.includes(event.key)) {
			event.preventDefault();
		}
	}

	const updateUser = (key: keyof UsersType, event: Event) => {
		const target = event.target as HTMLInputElement;

		isFieldEmpty = target.value.trim() === '';
		isSameAsInitial = (Object.keys($initialValues) as (keyof UsersType)[]).some(() => $initialValues[key] === target.value);

		usersStore.update(users => {
			const updatedUsers = { ...users, [key]: target.value };
			if (!users) {
				users = { ...updatedUsers };
			}
			return updatedUsers;
		});
	}

	const handleSubmit = async () => {
		toast.clear();
		const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
		const profile = {
			firstname: $usersStore.firstname,
			lastname: $usersStore.lastname,
			email: $usersStore.email,
			phone: $usersStore.phone
		} as Partial<UsersType>

		let response = false;

		if (profile.firstname != $initialValues.firstname) {
			if (profile.firstname.trim() === '') {
				toast.trigger({ ...toastError, message: 'Votre prénom est requis', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, firstname: false });
				return false;
			}

			await setProfile({ uid: $usersStore.uid, firstname: profile.firstname });
			response = true;
		}

		if (profile.lastname != $initialValues.lastname) {
			if (profile.lastname.trim() === '') {
				toast.trigger({ ...toastError, message: 'Votre nom est requis', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, lastname: false });
				return false;
			}

			await setProfile({ uid: $usersStore.uid, lastname: profile.lastname });
			response = true;
		}

		if (profile.email != $initialValues.email) {
			if (profile.email.trim() === '') {
				toast.trigger({ ...toastError, message: 'Votre adresse e-mail est requise', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, email: false });
				return false;
			}
			if (!emailRegex.test(profile.email)) {
				toast.trigger({ ...toastError, message: 'Votre adresse e-mail est invalide', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, email: false });
				return false;
			}

			await updateEmail(auth.currentUser, profile.email).then(async () => {
				await setProfile({ uid: $usersStore.uid, email: profile.email });
				response = true;
			}).catch(async (err) => {
				if (err.code === 'auth/requires-recent-login') {
					toast.trigger({ ...toastError, message: 'Vous devez avoir une connexion récente pour pouvoir modifier votre adresse e-mail.\nDéconnectez-vous, reconnectez-vous et rééssayez.', timeout: 7000, hideDismiss: true })
					usersStore.set({ ...$usersStore, email: $initialValues.email });
				}
				return false;
			});
		}

		if (profile.phone != $initialValues.phone) {
			if (profile.phone.trim() === '') {
				toast.trigger({ ...toastError, message: 'Votre numéro de téléphone est requis', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, phone: false });
				return false;
			}
			if (profile.phone.length !== 10) {
				toast.trigger({ ...toastError, message: 'Votre numéro de téléphone est invalide', hideDismiss: true });
				fieldsEnabled.set({ ...$fieldsEnabled, phone: false });
				return false;
			}

			await setProfile({ uid: $usersStore.uid, phone: profile.phone });
			response = true;
		}

		if (response) {
			initialValues.set($usersStore);

			isFieldEmpty = false;
			isSameAsInitial = true;

			resetField();
			await invalidate('/account');
			toast.trigger({ ...toastSuccess, message: 'Votre profil a bien été modifié', hideDismiss: true });
		}
	}
</script>

<div class="flex flex-col w-full">
	<h2 class="text-slate-800 text-lg font-semibold flex items-center">
		<Icon height={26} width={26}>
			<User/>
		</Icon>
		<span class="ml-2">Mon compte</span>
	</h2>
	<form method="post" class="w-full mt-5" on:submit|preventDefault={handleSubmit}>
		<div class="flex w-full gap-4">
			<button type="button" on:click={() => enableField('firstname')} class="w-full mb-5">
				<label for="firstname" class="flex flex-col w-full cursor-pointer">
							<span class="flex justify-between group">
								<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Prénom</span>
								<span class="{!$fieldsEnabled.firstname ? 'text-pink-600 opacity-100' : 'text-slate-400 opacity-50'} flex group-hover:opacity-100 group-hover:text-pink-600 transition-all duration-200">
									<Icon>
										<Edit/>
									</Icon>
								</span>
							</span>
					<input on:input={(event) => updateUser('firstname', event)} on:blur={resetField} id="firstname" name="firstname" disabled={$fieldsEnabled.firstname} bind:value={$usersStore.firstname} placeholder={users.firstname} type="text" class="capitalize placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
				</label>
			</button>
			<button type="button" on:click={() => enableField('lastname')} class="w-full mb-5">
				<label for="lastname" class="flex flex-col w-full cursor-pointer">
							<span class="flex justify-between group">
								<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Nom</span>
								<span class="{!$fieldsEnabled.lastname ? 'text-pink-600 opacity-100' : 'text-slate-400 opacity-50'} flex group-hover:opacity-100 group-hover:text-pink-600 transition-all duration-200">
									<Icon>
										<Edit/>
									</Icon>
								</span>
							</span>
					<input on:input={(event) => updateUser('lastname', event)} on:blur={resetField} id="lastname" name="lastname" disabled={$fieldsEnabled.lastname} bind:value={$usersStore.lastname} placeholder={users.lastname} type="text" class="capitalize placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
				</label>
			</button>
		</div>
		<div class="w-full">
			<button type="button" on:click={() => enableField('email')} class="w-full mb-5">
				<label for="email" class="flex flex-col w-full cursor-pointer">
							<span class="flex justify-between group">
								<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Adresse e-mail</span>
								<span class="{!$fieldsEnabled.email ? 'text-pink-600 opacity-100' : 'text-slate-400 opacity-50'} flex group-hover:opacity-100 group-hover:text-pink-600 transition-all duration-200">
									<Icon>
										<Edit/>
									</Icon>
								</span>
							</span>
					<input on:input={(event) => updateUser('email', event)} on:blur={resetField} id="email" name="email" disabled={$fieldsEnabled.email} bind:value={$usersStore.email} placeholder={users.email} type="text" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
				</label>
			</button>
		</div>
		<div class="w-full">
			<button type="button" on:click={() => enableField('phone')} class="w-full mb-2">
				<label for="phone" class="flex flex-col w-full cursor-pointer">
							<span class="flex justify-between group">
								<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Téléphone</span>
								<span class="{!$fieldsEnabled.phone ? 'text-pink-600 opacity-100' : 'text-slate-400 opacity-50'} flex group-hover:opacity-100 group-hover:text-pink-600 transition-all duration-200">
									<Icon>
										<Edit/>
									</Icon>
								</span>
							</span>
					<input on:keydown={handleKeyDown} on:blur={resetField} on:input={(event) => updateUser('phone', event)} disabled={$fieldsEnabled.phone} id="phone" name="phone" bind:value={$usersStore.phone} placeholder={users.phone} type="tel" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
				</label>
			</button>
		</div>
		{#if !isFieldEmpty && !isSameAsInitial}
			<button in:fly out:slide={{duration: 200}} type="submit" class="flex justify-center items-center mt-3 mx-auto overflow-hidden whitespace-nowrap disabled:hover:bg-pink-600 w-full py-2.5 px-5 shadow-md transition-all active:scale-[0.95] bg-pink-600 hover:bg-pink-700 duration-300 text-white text-lg font-medium focus:outline-0 rounded-2xl">
				Modifier votre compte
			</button>
		{/if}
	</form>
</div>
