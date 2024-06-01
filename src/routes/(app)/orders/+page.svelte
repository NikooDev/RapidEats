<script lang="ts">
	import { onMount } from 'svelte';
	import { getOrder } from '$lib/firebase/client';
	import { useUsersStore } from '$lib/stores/user';
	import { fly } from 'svelte/transition';
	import { OrderEnum } from '$lib/interfaces/order';
	import { Icon, Order } from '$lib/icons';
	import { Loading } from '$lib';
	import { ordersStore } from '$lib/stores/order';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import InDelivery from '$lib/components/app/order/InDelivery.svelte';
	import Pending from '$lib/components/app/order/Pending.svelte';

	const { userStore } = useUsersStore();

	$: loading = true;
	$: ordersPending = $ordersStore.filter((order) => order.status === OrderEnum.PENDING);
	$: ordersInDelivery = $ordersStore.filter((order) => order.status === OrderEnum.IN_DELIVERY);
	$: showOrderInDelivery = true;

	/**
	 * Dans le tracker, attendre 10 secondes avant d'attribuer un livreur et lancer le trajet
	 */

	onMount(async () => {
		const orders = await Promise.all($userStore.orders.map(async refOrder => {
			return await getOrder($userStore.uid, refOrder);
		}));

		ordersStore.set(orders.reverse());
		loading = false;
	});
</script>

<svelte:head>
	<title>Rapid Eats | Mes commandes</title>
</svelte:head>

<div class="container mx-auto px-5">
	{#if loading}
		<div class="justify-center items-center flex w-full mt-52">
			<Loading height={50} width={50} color="text-white" fill="fill-pink-600"/>
		</div>
	{:else}
		{#if $ordersStore.length === 0}
			<div class="w-full flex flex-col justify-center items-center text-slate-500 text-center h-[60vh]">
				<Icon height={80} width={80}>
					<Order/>
				</Icon>
				<p class="text-slate-800 font-bold text-2xl mt-3">Aucune commande pour le moment</p>
				<p class="text-slate-800 font-medium mt-2">Lorsque vous passerez une commande, elle s'affichera ici.<br>Vous
					pourrez suivre son état.</p>
				<a href="/"
					 class="flex bg-pink-600 h-11 mt-8 items-center justify-center text-white font-medium px-4 rounded-2xl hover:bg-pink-700 transition-colors duration-300">Trouver
					un restaurant</a>
			</div>
		{:else if $ordersStore}
			<div class="mt-7 pb-10">
				{#if ordersInDelivery.length > 0 && ordersPending.length > 0}
					<div class="flex items-center">
						<SlideToggle size="sm" name="showOrderInDelivery" background="bg-slate-500 shadow-md" active="bg-pink-600" bind:checked={showOrderInDelivery}/>
						<span class="ml-3 text-slate-800 text-sm font-semibold">{ showOrderInDelivery ? 'En livraison' : 'En attente' }</span>
					</div>
				{/if}
				{#if showOrderInDelivery}
					<div transition:fly>
						<InDelivery ordersInDelivery={ordersInDelivery}/>
						<Pending ordersPending={ordersPending}/>
					</div>
				{:else}
					<div transition:fly>
						<Pending ordersPending={ordersPending}/>
						<InDelivery ordersInDelivery={ordersInDelivery}/>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
