<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import { writable } from 'svelte/store';
	import { getModalStore, type ModalSettings, type ModalStore, type ToastStore } from '@skeletonlabs/skeleton';
	import { validateStep1Signup, validateStep2Signup } from '$lib/validator/signup';
	import { register } from '$lib/actions/auth';
	import { Loading, Modal } from '$lib';
	import { toastError, toastSuccess } from '$lib/config/toast';
	import type { RegisterType, SuggestionsAddressType } from '$lib/interfaces/auth';

	export let toast: ToastStore;
	export let modal: ModalStore

	const signup = writable<RegisterType>();
	const addressSuggestions = writable<SuggestionsAddressType[]>([]);

	let signupRef: HTMLFormElement;

	let lastname: string = '';
	let firstname: string = '';
	let email: string = '';
	let password: string = '';
	let confirmation: string = '';
	let numberStreet: string = '';
	let street: string = '';
	let postalCode: string = '';
	let city: string = '';
	let phone: string = '';
	let latitude: string = '';
	let longitude: string = '';
	let streetRef: HTMLInputElement;
	let lastnameRef: HTMLInputElement;

	const modalStore = getModalStore();
	const modalLogin: ModalSettings = {
		type: 'component',
		component: 'modalLogin',
		backdropClasses: 'w-screen'
	};
	$: isStepEnd = false;
	$: visible = false;
	$: emptySuggestion = false;
	$: loading = false;

	const handleSearchAddress = async () => {
		if (numberStreet.trim() === '' || street.trim() === '') {
			visible = false;
			addressSuggestions.set([]);
			return;
		}

		if (street.length < 3) {
			addressSuggestions.set([]);
			return;
		}

		visible = false;

		const query = `${numberStreet} ${street}`

		try {
			const req = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&type=housenumber&limit=10`);
			const datas = await req.json();

			const updatedAddresses = [
				...datas.features.map((feature: { properties: { [key: string]: string }, geometry: { [key: string]: string } }) => ({
					street: feature.properties.name,
					postalCode: feature.properties.postcode,
					city: feature.properties.city,
					longitude: feature.geometry.coordinates[0],
					latitude: feature.geometry.coordinates[1]
				}))
			];

			addressSuggestions.set(updatedAddresses);

			emptySuggestion = $addressSuggestions.length === 0;
		} catch (err) {
			console.log(err);
		}
	}

	const selectAddress = (suggestion: SuggestionsAddressType) => {
		numberStreet = suggestion.street.match(/^\d+/)[0];
		street = suggestion.street.replace(/^\d+\s*/, '');
		postalCode = suggestion.postalCode;
		city = suggestion.city;
		latitude = suggestion.latitude.toString();
		longitude = suggestion.longitude.toString();

		visible = true;
		emptySuggestion = false;
	}

	const openLoginModal = () => {
		modalStore.close();
		setTimeout(() => modalStore.trigger(modalLogin), 300);
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

	const handleSubmitStep1 = () => {
		toast.clear();

		signup.update(old => {
			return {
				...old,
				firstname: firstname.trim(),
				lastname: lastname.trim(),
				email: email.trim().toLowerCase(),
				password: password.trim(),
				confirmation: confirmation.trim()
			}
		})

		const validateStep1 = validateStep1Signup($signup, toast);

		if (validateStep1) {
			isStepEnd = true;
		}
	}

	const handleSubmitStep2 = async (event: Event) => {
		signup.update(old => {
			return {
				...old,
				address: {
					street: `${numberStreet.trim()} ${street.trim()}`,
					postalCode: postalCode.trim(),
					city: city.trim()
				},
				latitude: latitude,
				longitude: longitude,
				phone: phone.trim()
			}
		});

		const validateStep2 = validateStep2Signup($signup, toast);

		if (validateStep2) {
			loading = true;
			toast.clear();

			try {
				await register(event, $signup, toast, modal);
			} catch (err) {
				loading = false;
				toast.trigger({ ...toastError, message: 'Une erreur est survenue lors de votre inscription', hideDismiss: true });
			}
		}
	}

	onMount(() => {
		if (signupRef) {
			signupRef.addEventListener('submit', async (event) => {
				event.preventDefault();
				if (!isStepEnd) {
					handleSubmitStep1();
				} else {
					await handleSubmitStep2(event);
				}
			});
		}
	});

	onMount(() => {
		if (isStepEnd) {
			streetRef.focus();
		} else {
			lastnameRef.focus();
		}
	});

	export let parent: SvelteComponent | null;
	parent = null;
</script>

<Modal>
	<div class="flex relative w-full pt-5">
		<h1 class="text-center font-bold text-[1.3rem] text-slate-800 mx-auto">S'inscrire</h1>
	</div>
	<form action="/api/auth?/signup" bind:this={signupRef} method="post" class="w-full mt-5 h-full px-5 py-5" autocomplete="off">
		{#if !isStepEnd}
			<div class="flex gap-4 mb-5 flex-wrap md:flex-nowrap">
				<div class="w-full">
					<label for="lastname" class="flex flex-col w-full">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Nom</span>
						<!-- svelte-ignore a11y-autofocus -->
						<input type="text" disabled={loading} bind:this={lastnameRef} autofocus name="lastname" id="lastname" bind:value={lastname} class="capitalize shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Nom">
					</label>
				</div>
				<div class="w-full">
					<label for="firstname" class="flex flex-col w-full">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Prénom</span>
						<input type="text" disabled={loading} name="firstname" id="firstname" bind:value={firstname} class="capitalize shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Prénom">
					</label>
				</div>
			</div>
			<div class="w-full mb-5">
				<label for="email" class="flex flex-col w-full">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Adresse e-mail</span>
					<input type="text" disabled={loading} name="email" id="email" bind:value={email} autocomplete="off" class="shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Adresse e-mail">
				</label>
			</div>
			<div class="w-full mb-5">
				<label for="password" class="flex flex-col w-full">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Mot de passe</span>
					<input type="password" disabled={loading} name="password" maxlength={30} id="password" bind:value={password} autocomplete="new-password" class="shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Mot de passe">
				</label>
			</div>
			<div class="w-full mb-7">
				<label for="confirm" class="flex flex-col w-full">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Confirmation</span>
					<input type="password" disabled={loading} name="password" maxlength={30} id="confirm" bind:value={confirmation} class="shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Confirmation">
				</label>
			</div>
		{:else}
			<div class="flex gap-5 w-full mb-5">
				<label for="number" class="flex flex-col w-36">
					<span class="flex justify-between group">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Numéro de rue</span>
					</span>
					<!-- svelte-ignore a11y-autofocus -->
					<input type="text" disabled={loading} on:keyup={handleSearchAddress} autofocus bind:this={streetRef} bind:value={numberStreet} id="number" placeholder="Numéro de rue" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl"/>
				</label>
				<label for="street" class="flex flex-col w-full">
					<span class="flex justify-between group">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Rue</span>
					</span>
					<input type="text" disabled={loading} on:keyup={handleSearchAddress} bind:value={street} id="street" placeholder="Rue" class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl"/>
				</label>
			</div>
			{#if $addressSuggestions.length > 0}
				{#if !visible}
					<div class="absolute z-10 bg-white w-full shadow-md top-[11rem] left-0 px-4 py-3 rounded-b-2xl max-h-[16.5rem] overflow-auto">
						<div class="flex gap-1 flex-col">
							{#each $addressSuggestions as suggestion}
								<button type="button" on:click={() => selectAddress(suggestion)} class="flex px-3 last:mb-2 first:mt-0 py-2 text-sm text-slate-800 rounded-lg font-semibold hover:bg-pink-600 hover:text-white transition-colors duration-200">
									{ suggestion.street+', '+suggestion.postalCode+', '+suggestion.city }
								</button>
							{/each}
						</div>
					</div>
				{/if}
			{:else if emptySuggestion}
				<div class="absolute z-10 bg-white w-full shadow-md top-[11rem] left-0 px-4 py-3 rounded-b-2xl max-h-[16.5rem] overflow-auto">
					<p class="font-semibold px-3 py-2 text-sm text-slate-800">Aucun résultat</p>
				</div>
			{/if}
			{#if visible}
				<div class="w-full mb-5">
					<label for="postalCode" class="flex flex-col w-full cursor-pointer">
					<span class="flex justify-between group">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Code postal</span>
					</span>
						<input type="text" id="postalCode" bind:value={postalCode} on:keydown|preventDefault|stopPropagation disabled class="shadow-md text-slate-800 font-medium border-2 border-white focus:outline-0 p-3 rounded-2xl"/>
					</label>
				</div>
				<div class="w-full mb-7">
					<label for="city" class="flex flex-col w-full cursor-pointer">
					<span class="flex justify-between group">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Ville</span>
					</span>
						<input type="text" id="city" bind:value={city} disabled on:keydown|preventDefault|stopPropagation class="shadow-md text-slate-800 font-medium border-2 border-white focus:outline-0 p-3 rounded-2xl"/>
					</label>
				</div>
			{/if}
			<div class="w-full mb-6">
				<label for="phone" class="flex flex-col w-full">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold font-quicksand">Téléphone</span>
					<input type="text" disabled={loading} on:keydown={handleKeyDown} name="phone" id="phone" bind:value={phone} class="shadow-md selection:bg-pink-600 selection:text-white focus:text-pink-600 text-slate-800 font-medium font-quicksand border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl" placeholder="Téléphone">
				</label>
			</div>
		{/if}
		{#if isStepEnd}
			<div class="mb-2">
				<p class=" text-[.8rem] text-center text-slate-800">En cliquant sur <span class="font-bold">Créer un compte</span>, vous acceptez nos <a href="/" class="inline-flex hover:underline font-bold text-pink-600">Conditions d'Utilisation</a>.</p>
			</div>
		{/if}
		<div class="flex gap-5 w-full mb-5 { isStepEnd ? 'mt-2' : 'mt-0' }">
			{#if isStepEnd}
				<button type="button" disabled={loading} on:click|preventDefault={() => isStepEnd = false} class="w-full font-quicksand shadow-md transition-all active:scale-[0.95] bg-slate-200 hover:bg-slate-300 duration-300 text-slate-800 text-lg font-medium focus:outline-0 py-2.5 px-5 rounded-2xl">
					Précédent
				</button>
			{/if}
			<button type="submit" disabled={loading} class="flex justify-center items-center mx-auto overflow-hidden whitespace-nowrap disabled:hover:bg-pink-600 w-full py-2.5 px-5 shadow-md transition-all active:scale-[0.95] bg-pink-600 hover:bg-pink-700 duration-300 text-white text-lg font-medium focus:outline-0 rounded-2xl">
				{#if isStepEnd}
					{#if loading}
						<Loading width={28} height={28}/>
						<span class="ml-2.5">Chargement...</span>
					{:else}
						Créer un compte
					{/if}
				{:else}
					Suivant
				{/if}
			</button>
		</div>
		<div class="flex justify-center">
			<a href="/" on:click={openLoginModal} class="inline-flex font-quicksand hover:underline text-slate-800 font-semibold">J'ai déjà un compte</a>
		</div>
	</form>
</Modal>
