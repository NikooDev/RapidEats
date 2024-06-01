<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';
	import Track from '$lib/components/Track.svelte';
	import { Icon, Order } from '$lib/icons';

	const { userStore, restaurantsStore } = useUsersStore();
	let showTracker = false;
	let fullName = `${$userStore.firstname.toCapitalize()} ${$userStore.lastname.toCapitalize()}`;

	/**
	 * Attribuer un livreur à la commande
	 * Modifier le status du livreur (en livraison) et de la commande "En attente"
	 * Attendre 10 secondes avant l'envoie du livreur (notification pour informer les clients)
	 *
	 * Modifier le status de la commande "En livraison"
	 *
	 * Pour chaque commande dans $userStore.orders[index]
	 * Envoyer dans le Tracker
	 * - $userStore.orders[index].restaurant.title
	 * - $userStore.orders[index].restaurant.latitude
	 * - $userStore.orders[index].restaurant.longitude
	 * - $userStore.firstname
	 * - $userStore.latitude
	 * - $userStore.longitude
	 *
	 * Stocker le temps de trajet dans le store en millisecondes
	 * Attribuer la position du restaurant au livreur
	 * Mettre à jour dans Firebase la latitude et longitude du livreur dans l'animation (chaque seconde) du tracker.
	 * Au rechargement de la page, le livreur ne recommencera pas le trajet à zéro
	 *
	 * Lorsque la commande est livrée, notification pour indiquer que le livreur est arrivé
	 * Afficher un bouton pour mettre fin à la commande
	 * Au clic, modifier le status de la commande à "Terminée"
	 */

	const ok = () => {
		showTracker = !showTracker;
	}
</script>

<svelte:head>
	<title>Rapid Eats | Tracker</title>
</svelte:head>

<div class="flex items-center flex-wrap justify-between" style="height: calc(100vh - 4rem)">
	<div class="w-full flex flex-col justify-center items-center text-slate-500">
		<Icon height={80} width={80}>
			<Order/>
		</Icon>
		<p class="text-slate-800 font-bold text-2xl mt-3">Aucune commande pour le moment</p>
		<p class="text-slate-800 font-medium mt-2">Lorsque vous passerez une commande, elle s'affichera ici.</p>
		<button on:click|preventDefault={ok}>
			POST
		</button>
	</div>

	<div class="map-track sm:rounded-t-2xl rounded-none w-full container mx-auto mt-auto overflow-hidden relative">
		{#if showTracker}
			<Track fullName={fullName} restaurant={$restaurantsStore[2].title} geoUser={{lat: parseFloat($userStore.latitude), lng: parseFloat($userStore.longitude)}}
						 geoDeliveryman={{lat: parseFloat($restaurantsStore[2].latitude), lng: parseFloat($restaurantsStore[2].longitude)}}/>
		{/if}
	</div>
</div>
