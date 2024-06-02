<script lang="ts">
	import { Icon, Order } from '$lib/icons';
	import { Loading } from '$lib';
	import { onDestroy, onMount } from 'svelte';
	import { getDeliveredOrders } from '$lib/firebase/client';
	import { writable } from 'svelte/store';
	import type { UsersType } from '$lib/interfaces/user';
	import { type OrderType } from '$lib/interfaces/order';
	import Masonry from 'svelte-bricks';

	export let users: UsersType;

	const ordersDelivered = writable<OrderType[]>([]);
	const dateOption = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	} as Intl.DateTimeFormatOptions;

	$: loading = true;

	onMount(async () => {
		const orders = await getDeliveredOrders(users.uid);
		ordersDelivered.set(orders);
		loading = false;
	});

	onDestroy(() => {
		loading = true;
	});
</script>


<div class="flex flex-col w-full items-center">
	<h2 class="text-slate-800 text-lg font-semibold flex items-center">
		<Icon height={22} width={22}>
			<Order/>
		</Icon>
		<span class="ml-2.5">Historique des commandes</span>
	</h2>
	<div class="mt-5 pb-5 w-full">
		{#if loading}
			<div class="py-6 flex justify-center items-center">
				<Loading height={50} width={50} color="text-white" fill="fill-pink-600"/>
			</div>
		{:else}
			{#if $ordersDelivered.length > 0}
				<div class="w-full flex">
					<Masonry idKey="uid" items={$ordersDelivered} maxColWidth={1200} minColWidth={300} class="w-full" let:item>
						<div class="inline-block bg-white rounded-2xl shadow-md pr-5 pl-4 py-5 w-full">
							<div class="flex items-center justify-between">
								<p class="text-slate-800 font-semibold text-lg">Commande n° { item.uid.substring(10).toUpperCase() }</p>
							</div>
							<p class="text-sm text-slate-500 font-medium">{ item.created.toDate().toLocaleDateString('fr-FR', dateOption) }</p>
							<p class="mt-3 text-slate-800 font-medium">Statut : livrée</p>
							<p class="text-slate-800 font-medium">Livreur : { item.deliveryman.firstname.toCapitalize() }</p>
							<div class="h-0.5 bg-slate-200 w-full my-3"/>
							<div class="flex flex-col">
								{#each item.restaurants as restaurant}
									<div class="flex items-center">
										<p class="text-pink-600 font-semibold">{ restaurant.title }</p>
									</div>
									{#each restaurant.menus as menu, index}
										<div
												class="flex items-center justify-between last:mb-0 m-2 p-2 {index === restaurant.menus.length - 1 ? 'mb-3' : 'mb-0'}">
											<div class="flex items-center">
												<p class="text-lg text-slate-800 font-semibold h-7 min-w-7 w-auto mr-3 px-1.5 flex justify-center items-center bg-slate-200 rounded-2xl">{ menu.quantity }</p>
												<p class="text-sm text-slate-800 font-semibold pr-5">{ menu.title }</p>
											</div>
											<p class="text-sm text-slate-800 font-semibold whitespace-nowrap">{ menu.price.toFixed(2) } €</p>
										</div>
									{/each}
								{/each}
							</div>
							<div class="h-0.5 bg-slate-200 w-full my-3"/>
							<p class="text-slate-800 font-semibold flex justify-end text-lg">TOTAL : { item.totalPrice.toFixed(2) } €</p>
						</div>
					</Masonry>
				</div>
			{:else}
				<div class="py-4">
					<div class="mt-5 flex flex-col w-full items-center text-center">
						<p class="text-slate-800 font-bold">Aucune commande pour le moment</p>
						<p class="text-slate-800 font-medium text-sm">Vos commandes terminées s'affichent ici.</p>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
