<script lang="ts">
	import Track from '$lib/components/app/Track.svelte';
	import { orderStore } from '$lib/stores/order';

	$: order = $orderStore;

	$: created = order.created.toDate().toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});
</script>

<svelte:head>
	<title>Rapid Eats | Tracker</title>
</svelte:head>

<div class="flex items-center container mx-auto flex-wrap justify-between" style="height: calc(100vh - 4rem)">
	<div class="flex flex-col justify-center w-full items-start relative mt-5 mb-5 -z-0">
		<div class="flex flex-col w-full bg-white min-h-[18.5rem] rounded-2xl shadow-md pr-5 pl-4 py-5">
			<div class="flex flex-col md:flex-row w-full">
				<div class="flex flex-col w-full">
					<div class="flex items-center justify-between">
						<p class="text-slate-800 font-semibold text-lg whitespace-nowrap">Commande n° { order.uid.substring(10).toUpperCase() }</p>
					</div>
					<p class="text-sm text-slate-500 font-medium">{ created }</p>
					<p class="mt-3 text-slate-800 font-medium">Statut : { order.status === 'in_delivery' ? 'En livraison' : 'Livrée' }</p>
					<p class="text-slate-800 font-medium">Livreur : { order.deliveryman.firstname.toCapitalize() }</p>
					<p class="text-slate-800 bg-white mt-3 font-semibold flex text-lg">TOTAL : { order.totalPrice.toFixed(2) } €</p>
				</div>
				<div class="flex flex-col w-full mt-5 md:mt-0 overflow-auto">
					{#each order.restaurants as restaurant}
						<div class="flex items-center">
							<p class="text-pink-600 font-semibold">{ restaurant.title }</p>
						</div>
						{#each restaurant.menus as menu, index}
							<div class="flex items-center justify-between bg-slate-100 rounded-3xl hover:bg-slate-200 transition-colors duration-200 last:mb-0 m-2 p-2 {index === restaurant.menus.length - 1 ? 'mb-3' : 'mb-0'}">
								<div class="flex items-center overflow-hidden">
									<p class="text-lg text-slate-800 font-semibold h-7 min-w-7 w-auto mr-3 px-1.5 flex justify-center items-center bg-slate-200 rounded-2xl">{ menu.quantity }</p>
									<p class="text-sm text-slate-800 font-semibold pr-5 whitespace-nowrap w-80 text-ellipsis overflow-hidden">{ menu.title }</p>
								</div>
								<p class="text-sm text-slate-800 font-semibold whitespace-nowrap pr-1">{ menu.price.toFixed(2) } €</p>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="map-track bg-white sm:rounded-t-2xl rounded-none w-full mt-auto sticky bottom-0 overflow-hidden z-10">
		<Track order={order}/>
	</div>
</div>
