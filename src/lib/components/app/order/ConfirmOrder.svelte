<script lang="ts">
	import { Loading, Modal } from '$lib';
	import type { OrderType } from '$lib/interfaces/order';
	import { onDestroy, onMount } from 'svelte';
	import { confirmOrder } from '$lib/firebase/client';
	import { useUsersStore } from '$lib/stores/user';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { invalidate } from '$app/navigation';

	export let order: OrderType;
	const { userStore, deliverymanStore } = useUsersStore();
	const modalStore = getModalStore();

	$: timer = null as ReturnType<typeof setInterval> | null;
	$: deliveryman = $deliverymanStore;
	$: search = true;

	onMount(async () => {
		const result = await confirmOrder($userStore.uid, order);

		if (result) {
			search = false;
			timer = setTimeout(() => modalStore.clear(), 1000);
		}
	});

	onDestroy(async () => {
		clearInterval(timer);
	});
</script>

<div class="fixed h-full w-screen top-0 left-0 flex justify-center items-center">
	<Modal>
		<div class="py-5 px-5 w-full">
			<div class="relative flex items-center justify-center w-full">
				<div class="relative flex flex-col items-center">
					<div class="w-8 h-8 bg-pink-600 rounded-full animate-ping absolute -z-0"/>
					<div class="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white">
						<Loading height={18} width={18}/>
					</div>
				</div>
			</div>
			<div class="flex justify-center mt-5">
				{#if search}
					<p class="text-2xl text-slate-800 font-semibold">Recherche d'un livreur...</p>
				{:else}
					<p class="text-2xl text-slate-800 font-semibold">{ deliveryman && deliveryman.firstname.toCapitalize() } livrera votre commande</p>
				{/if}
			</div>
		</div>
	</Modal>
</div>
