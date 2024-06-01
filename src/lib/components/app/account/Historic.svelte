<script lang="ts">
	import { Icon, Order } from '$lib/icons';
	import { Loading } from '$lib';
	import { onDestroy, onMount } from 'svelte';
	import { getDeliveredOrders } from '$lib/firebase/client';
	import { writable } from 'svelte/store';
	import type { UsersType } from '$lib/interfaces/user';
	import { type OrderType } from '$lib/interfaces/order';

	export let users: UsersType;

	const ordersDelivered = writable<OrderType[]>([]);

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
	<div class="mt-5 pb-5">
		{#if loading}
			<div class="py-6">
				<Loading height={50} width={50} color="text-white" fill="fill-pink-600"/>
			</div>
		{:else}
			<div class="py-4">
				<div class="mt-5 flex flex-col w-full items-center text-center">
					<p class="text-slate-800 font-bold">Aucune commande pour le moment</p>
					<p class="text-slate-800 font-medium text-sm">Vos commandes terminées s'affichent ici.</p>
				</div>
			</div>
		{/if}
	</div>
</div>
