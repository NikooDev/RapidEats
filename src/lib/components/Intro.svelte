<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';
	import { Cart, Hamburger, Icon, Map, User } from '$lib/icons';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { setProfile } from '$lib/firebase/client';
	import { Loading } from '$lib';

	const { userStore } = useUsersStore();

	let currentStep = writable(0);
	$: end = false;

	const handleNext = () => {
		currentStep.update(n => (n < 2 ? n + 1 : n));
	}

	const handlePrev = () => {
		currentStep.update(n => (n > 0 ? n - 1 : n));
	}

	const handleEnd = async () => {
		end = true;
		await setProfile({ uid: $userStore.uid, tuto: false });
	}
</script>

<div class="bg-black bg-opacity-50 top-16 fixed w-full h-full overflow-hidden flex z-[999] { end ? 'hidden' : '' }">
	<div class="fixed top-0 w-full h-16"/>
	{#if $currentStep === 0 }
	<div transition:fly class="bg-white shadow-md rounded-2xl w-72 absolute right-5 top-5 px-3 py-2">
		<div>
			<p class="font-semibold text-pink-600 flex justify-between items-center">
				<span>Visite guidée</span>
				<span>1/3</span>
			</p>
			<div class="h-0.5 bg-slate-200 w-full mt-2 mb-3"/>
			<p class="text-sm text-slate-800 font-medium">
				Le bouton en haut à droite vous permet d'accéder à vos commandes en attente et en cours de livraison.
				<br/>Vous pouvez également modifier votre profil et vous déconnecter.
				<span class="relative inline-flex items-center mb-2 mt-2">
					La notification
					<span class="ml-2 mr-4">
						<Icon height={28} width={28}>
							<User/>
						</Icon>
						<span class="absolute -top-1.5 right-0.5 h-5 min-w-[1.25rem] px-1 bg-pink-600 text-white rounded-[30px] text-center text-sm font-semibold leading-5">
							2
						</span>
					</span>
				</span>
				vous indique le nombre de commande en attente et en cours de livraison.
			</p>
			<div class="flex mt-3 px-1 py-2 justify-end">
				<button on:click={handleNext} class="bg-pink-600 text-white hover:bg-pink-700 text-sm font-semibold transition-colors duration-300 px-3 py-1 rounded-lg">Suivant</button>
			</div>
		</div>
	</div>
	{/if}
	{#if $currentStep === 1 }
	<div transition:fly class="bg-white shadow-md rounded-2xl w-72 absolute right-1/2 -mr-[9rem] top-5 px-3 py-2">
		<div>
			<p class="font-semibold text-pink-600 flex justify-between items-center">
				<span>Visite guidée</span>
				<span>2/3</span>
			</p>
			<div class="h-0.5 bg-slate-200 w-full mt-2 mb-3"/>
			<p class="text-sm text-slate-800 font-medium">
				Vous pouvez rechercher des restaurants et des menus en utilisant le formulaire de recherche.<br/><br/>
				<span class="inline-flex items-center mb-2">
				Le bouton
					<span class="mx-2 text-pink-600">
						<Icon height={20} width={20}>
							<Map/>
						</Icon>
					</span>
				</span>
				permet d'afficher ou masquer la map.<br/>
				<span class="inline-flex items-center mb-2 mt-2">
				Cliquez sur
					<span class="mx-2 text-slate-800">
						<Icon height={20} width={20}>
							<Cart/>
						</Icon>
					</span>
				</span>
				pour afficher ou masquer votre panier.
			</p>
			<div class="flex justify-between items-center mt-3 px-1 py-2">
				<button on:click={handlePrev} class="bg-slate-500 text-white hover:bg-slate-600 text-sm font-semibold transition-colors duration-300 px-3 py-1 rounded-lg">Précédent</button>
				<button on:click={handleNext} class="bg-pink-600 text-white hover:bg-pink-700 text-sm font-semibold transition-colors duration-300 px-3 py-1 rounded-lg">Suivant</button>
			</div>
		</div>
	</div>
	{/if}
	{#if $currentStep === 2 }
	<div transition:fly class="bg-white shadow-md rounded-2xl w-72 absolute left-5 top-5 px-3 py-2">
		<div>
			<p class="font-semibold text-pink-600 flex justify-between items-center">
				<span>Visite guidée</span>
				<span>3/3</span>
			</p>
			<div class="h-0.5 bg-slate-200 w-full mt-2 mb-3"/>
			<p class="text-sm text-slate-800 font-medium">
				<span class="inline-flex items-center mb-2">
					En cliquant sur le bouton
					<span class="mx-2 h-10 w-10 bg-pink-600 rounded-full text-white flex justify-center items-center">
						<Icon viewBox={'0 0 512 512'} height={18} width={18}>
							<Hamburger/>
						</Icon>
					</span>
				</span><br/>
				vous pouvez voir un aperçu de vos 5 dernières commandes en cours de livraison.<br/>
				<span class="inline-flex items-center mb-2 mt-3">
					L'indicateur
					<span class="mx-2 h-10 w-10 bg-pink-600 rounded-full text-white flex justify-center items-center">
						<Loading height={24} width={24}/>
					</span>
				</span><br/>
				s'affiche lorsque des données ou une page sont en chargement.
			</p>
			<div class="flex justify-between items-center mt-3 px-1 py-2">
				<button on:click={handlePrev} class="bg-slate-500 text-white hover:bg-slate-600 text-sm font-semibold transition-colors duration-300 px-3 py-1 rounded-lg">Précédent</button>
				<button on:click={handleEnd} class="bg-pink-600 text-white hover:bg-pink-700 text-sm font-semibold transition-colors duration-300 px-3 py-1 rounded-lg">Terminer</button>
			</div>
		</div>
	</div>
	{/if}
</div>
