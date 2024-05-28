<script lang="ts">
	import { Icon, Home } from '$lib/icons';
	import Edit from '$lib/icons/Edit.svelte';
	import { writable } from 'svelte/store';
	import { clickOutside } from '$lib/helpers/outside';
	import type { UsersType } from '$lib/interfaces/user';
	import type{ SuggestionsAddressType } from '$lib/interfaces/auth';

	export let users: UsersType;

	const fieldsEnabled = writable(false);
	const addressSuggestions = writable<SuggestionsAddressType[]>([]);

	let numberStreet: string = '';
	let street: string = '';
	let postalCode: string = '';
	let city: string = '';
	let streetRef: HTMLInputElement;

	$: visible = false;
	$: emptySuggestion = false;

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

		visible = true;
		emptySuggestion = false;
	}
</script>

<div class="flex flex-col w-full" use:clickOutside on:click_outside={() => fieldsEnabled.set(false)}>
	<button on:click={() => fieldsEnabled.set(true)} on:click={() => streetRef.focus()}>
		<span class="text-slate-800 text-lg font-semibold flex items-center hover:cursor-pointer">
			<Icon height={24} width={24}>
				<Home/>
			</Icon>
			<span class="ml-2">Adresse</span>
			<span class="{$fieldsEnabled ? 'text-pink-600 opacity-100' : 'text-slate-400 opacity-50'} ml-auto flex group-hover:opacity-100 group-hover:text-pink-600 transition-all duration-200">
			<Icon>
				<Edit/>
			</Icon>
		</span>
		</span>
	</button>
	{#if !$fieldsEnabled}
		<div class="w-full mt-5 text-slate-800 font-medium">
			<p>{ users.address.street }</p>
			<p>{ users.address.postalCode }</p>
			<p>{ users.address.city }</p>
		</div>
	{:else}
	<form method="post" class="w-full mt-5 relative" autocomplete="off">
		<div class="flex gap-5 w-full {visible ? 'mb-5' : 'mb-2'}">
			<label for="number" class="flex flex-col w-36 cursor-pointer">
				<span class="flex justify-between group">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Numéro de rue</span>
				</span>
				<input type="text" on:keyup={handleSearchAddress} bind:this={streetRef} bind:value={numberStreet} id="number" placeholder={users.address.street.match(/^\d+/)[0]} class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl"/>
			</label>
			<label for="street" class="flex flex-col w-full cursor-pointer">
				<span class="flex justify-between group">
					<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Rue</span>
				</span>
				<input type="text" on:keyup={handleSearchAddress} bind:value={street} id="street" placeholder={users.address.street.replace(/^\d+\s*/, '')} class="placeholder:text-slate-500 shadow-md focus:text-pink-600 text-slate-800 font-medium border-2 border-white transition-all focus:border-2 focus:border-pink-600 focus:outline-0 p-3 rounded-2xl"/>
			</label>
		</div>
		{#if $addressSuggestions.length > 0}
			{#if !visible}
				<div class="absolute z-10 bg-white w-full shadow-md top-24 px-4 py-3 rounded-b-2xl max-h-56 overflow-auto">
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
			<div class="absolute z-10 bg-white w-full shadow-md top-24 px-4 py-3 rounded-b-2xl max-h-56 overflow-auto">
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
			<div class="w-full mb-2">
				<label for="city" class="flex flex-col w-full cursor-pointer">
					<span class="flex justify-between group">
						<span class="text-slate-800 mb-1.5 text-[.9rem] font-bold">Ville</span>
					</span>
					<input type="text" id="city" bind:value={city} disabled on:keydown|preventDefault|stopPropagation class="shadow-md text-slate-800 font-medium border-2 border-white focus:outline-0 p-3 rounded-2xl"/>
				</label>
			</div>
			<div class="w-full mt-5">
				<button type="submit" class="flex justify-center items-center mx-auto overflow-hidden whitespace-nowrap disabled:hover:bg-pink-600 w-full py-2.5 px-5 shadow-md transition-all active:scale-[0.95] bg-pink-600 hover:bg-pink-700 duration-300 text-white text-lg font-medium focus:outline-0 rounded-2xl">
					Modifier votre adresse
				</button>
			</div>
		{/if}
	</form>
		{/if}
</div>
