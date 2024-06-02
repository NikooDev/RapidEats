<script lang="ts">
	import { Timestamp } from 'firebase/firestore';
	import { modalLogin, modalSignup } from '$lib/config/modal';
	import { ordersStore } from '$lib/stores/order';
	import { OrderEnum } from '$lib/interfaces/order';
	import { Icon, Order } from '$lib/icons';
	import { useUsersStore } from '$lib/stores/user';
	import { useAuthStore } from '$lib/stores/auth';
	import type { DrawerStore, ModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { getOrder } from '$lib/firebase/client';
	import { Loading } from '$lib';

	export let drawer: DrawerStore;
	export let modal: ModalStore;

	$: ordersInDelivery = $ordersStore.filter((order) => order.status === OrderEnum.IN_DELIVERY).slice(-5);
	$: loading = true;

	const dateFormat = (date: Timestamp): string => {
		return date.toDate().toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	}

	onMount(() => {
		setTimeout(async () => {
			const orders = await Promise.all($userStore.orders.map(async refOrder => {
				return await getOrder($userStore.uid, refOrder);
			}));

			ordersStore.set(orders.reverse());
			loading = false;
		}, 500);
	});

	const authStore = useAuthStore();
	const { userStore } = useUsersStore();
</script>

<aside class="flex flex-col h-full pt-3">
	<h2 class="text-center py-2 text-slate-800 font-medium text-[1.2rem]">Rapid <span class="font-bold text-pink-600">Eats</span></h2>
	<nav class="mt-5">
		<div class="flex flex-col gap-2">
			{#if $authStore && $userStore}
				<div>
					{#if loading}
						<div class="justify-center items-center flex w-full">
							<Loading height={50} width={50} color="text-white" fill="fill-pink-600"/>
						</div>
					{:else}
						{#if ordersInDelivery.length === 0}
							<div class="w-full flex flex-col justify-center items-center text-slate-500 text-center">
								<Icon height={50} width={50}>
									<Order/>
								</Icon>
								<p class="text-slate-800 font-bold text-lgl mt-3">Aucune commande en livraison pour le moment</p>
							</div>
						{:else if $ordersStore}
							<div class="mb-3">
								<p class="text-slate-800 text-[.9rem] font-semibold leading-tight">5 dernières commandes<br/>en livraison :</p>
							</div>
							<div class="flex flex-col gap-2">
								{#each ordersInDelivery as order}
									<a data-sveltekit-preload-data="tap" href="/orders" class="bg-white group shadow-md hover:shadow-lg transition-all duration-200 w-full px-3 py-3 rounded-lg">
										<span class="text-sm font-medium group-hover:text-pink-600 transition-colors duration-200">Commande n° { order.uid.substring(10).toUpperCase() }</span>
										<p class="text-xs text-slate-500 font-medium">{ dateFormat(order.created) }</p>
									</a>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
			{:else}
				<div>
					<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalSignup)} data-sveltekit-preload-data="hover" class="btn bg-pink-600 hover:bg-pink-700 transition-all duration-300 w-full rounded-lg text-white text-lg font-medium active:scale-[0.9]">Créer un compte</a>
				</div>
				<div>
					<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalLogin)} data-sveltekit-preload-data="hover" class="btn bg-slate-200 hover:bg-slate-300 transition-all duration-300 w-full rounded-lg text-slate-800 text-lg font-medium active:scale-[0.9]">Se connecter</a>
				</div>
			{/if}
		</div>
	</nav>
	<div class="mt-4 leading-8">
		<div>
			<a href="/" class="text-[.9rem] font-medium hover:text-pink-600 text-slate-800 duration-200 transition-colors">Ajoutez votre restaurant</a>
		</div>
		<div>
			<a href="/" class="text-[.9rem] font-medium hover:text-pink-600 text-slate-800 duration-200 transition-colors">Devenez coursier</a>
		</div>
	</div>
	<div class="flex mt-auto pb-2">
		<p class="text-slate-800 font-medium text-sm">Rapid <span class="font-bold text-pink-600">Eats</span> © { new Date().getFullYear() }</p>
	</div>
</aside>
