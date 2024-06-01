<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { login } from '$lib/actions/auth';
	import { Modal, Loading } from '$lib';
	import { modalSignup } from '$lib/config/modal';
	import { toastError } from '$lib/config/toast.js';
	import { Icon, Back } from '$lib/icons';
	import { type ModalStore, type ToastStore } from '@skeletonlabs/skeleton';

	export let toast: ToastStore;
	export let modal: ModalStore;

	let email: string = '';
	let password: string = '';

	let emailRef: HTMLInputElement;
	let recoverRef: HTMLInputElement;
	let passwordRef: HTMLInputElement;

	$: recoverPassword = false;
	$: loading = false;
	$: error = false;
	$: errorMessage = '';

	onMount(() => {
		return () => {
			toast.clear();
			loading = false;
		}
	});

	const handleSubmit = async (event: Event) => {
		error = false;
		loading = true;
		toast.clear();

		try {
			await login(event, { email, password }, toast);

			modal.close();
		} catch (err) {
			loading = false;
			error = true;

			if (err instanceof Error) {
				switch (err.code) {
					case 'auth/invalid-email':
						errorMessage = 'Votre adresse e-mail est incorrecte';
						!recoverPassword ? emailRef.focus() : recoverRef.focus();
						break;
					case 'auth/missing-password':
						errorMessage = 'Votre mot de passe est incorrect';
						passwordRef.focus();
						break;
					case 'auth/invalid-credential':
						errorMessage = 'Vos identifiants sont incorrects';
						emailRef.focus();
						break;
					case 'auth/too-many-requests':
						errorMessage = 'Vous effectuez trop de tentatives intempestives.\nPatientez un moment et réessayez ou réinitialisez votre mot de passe.';
						break;
					default:
						errorMessage = 'Une erreur est survenue lors de la connexion';
						break;
				}

				console.log(err.message);
			}

			toast.trigger({ ...toastError, message: errorMessage, hideDismiss: true });
		}
	}
</script>

<Modal error={error}>
	<div class="flex relative w-full pt-5">
		{#if recoverPassword}
			<div class="flex absolute top-3 left-3">
				<a href="/" on:click={() => recoverPassword = loading} class="text-slate-800 hover:bg-slate-200 transition-colors duration-300 flex justify-center items-center rounded-full h-10 w-10" aria-label="Retour" role="button">
					<Icon>
						<Back/>
					</Icon>
				</a>
			</div>
		{/if}
		<h1 class="text-center font-bold text-[1.3rem] text-slate-800 mx-auto">{recoverPassword ? 'Mot de passe oublié ?' : 'Se connecter'}</h1>
	</div>
	<form method="post" action={!recoverPassword ? '/api/auth?/login' : '/api/auth?/recover'} on:submit|preventDefault={handleSubmit} class="mt-5 w-full px-5 py-5 overflow-clip max-h-full transition-all duration-300 {recoverPassword ? 'h-[12.5rem]' : 'h-[23.4rem]'}">
		{#if recoverPassword}
			<div in:fade out:slide>
				<div class="w-full mb-7">
					<label for="recover" class="flex flex-col w-full">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Adresse e-mail</span>
						<!-- svelte-ignore a11y-autofocus -->
						<input bind:this={recoverRef} autofocus={true} type="text" name="email" id="recover" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Adresse e-mail">
					</label>
				</div>
				<div class="w-full">
					<button type="submit" disabled={loading} class="flex justify-center items-center mx-auto overflow-hidden whitespace-nowrap disabled:hover:bg-pink-600 { !loading ? 'w-full py-2.5 px-5' : 'max-w-full w-[11.3rem] rounded-full py-2.5 px-3.5' } shadow-md transition-all active:scale-[0.95] bg-pink-600 hover:bg-pink-700 duration-300 text-white text-lg font-medium focus:outline-0 rounded-2xl">
						{#if loading}
							<Loading width={28} height={28}/>
							<span class="ml-2.5">Chargement...</span>
						{:else}
							Réinitialiser mon mot de passe
						{/if}
					</button>
				</div>
			</div>
		{:else}
			<div in:fade out:slide>
				<div class="w-full mb-5">
					<label for="email" class="flex flex-col w-full">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Adresse e-mail</span>
						<!-- svelte-ignore a11y-autofocus -->
						<input bind:this={emailRef} bind:value={email} autofocus={true} type="text" name="email" id="email" placeholder="Adresse e-mail" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
					</label>
				</div>
				<div class="w-full mb-1.5">
					<label for="password" class="flex flex-col w-full">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Mot de passe</span>
						<input bind:this={passwordRef} bind:value={password} type="password" name="password" id="password" placeholder="Mot de passe" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl">
					</label>
				</div>
				<div class="flex mb-7">
					<a href="/" on:click={() => recoverPassword = true} class="inline-flex shrink-0 text-[.8rem] ml-auto text-pink-600 font-bold hover:underline">Mot de passe oublié ?</a>
				</div>
				<div class="w-full mb-5">
					<button type="submit" disabled={loading} class="flex justify-center items-center mx-auto overflow-hidden whitespace-nowrap disabled:hover:bg-pink-600 { !loading ? 'w-full py-2.5 px-5' : 'max-w-full w-[10.3rem] rounded-full py-2.5 px-3.5' } shadow-md transition-all active:scale-[0.95] bg-pink-600 hover:bg-pink-700 duration-300 text-white text-lg font-medium focus:outline-0 rounded-2xl">
						{#if loading}
							<Loading width={28} height={28}/>
							<span class="ml-2.5">Connexion...</span>
						{:else}
							Connexion
						{/if}
					</button>
				</div>
				<div class="flex justify-center">
					<a href="/" on:click={() => modal.clear()} on:click={() => setTimeout(() => modal.trigger(modalSignup), 200)} class="inline-flex hover:underline text-slate-800 font-semibold">Créer un compte</a>
				</div>
			</div>
		{/if}
	</form>
</Modal>
