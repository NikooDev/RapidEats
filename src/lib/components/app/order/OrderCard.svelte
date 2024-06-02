<script lang="ts">
	import { OrderEnum, type OrderType } from '$lib/interfaces/order';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { useUsersStore } from '$lib/stores/user';
	import { cancelOrder } from '$lib/firebase/client';
	import Confirm from '$lib/components/containers/Confirm.svelte';
	import { invalidate } from '$app/navigation';
	import { toastSuccess } from '$lib/config/toast';
	import ConfirmOrder from '$lib/components/app/order/ConfirmOrder.svelte';

	export let data: OrderType;
	export let status: string;

	const {userStore} = useUsersStore();
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: created = data.created.toDate().toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});

	const handleCancel = async () => {
		new Promise<boolean>(() => {
			modalStore.trigger({
				backdropClasses: 'w-screen',
				type: 'component',
				component: {
					ref: Confirm,
					props: {
						title: 'Confirmer l\'annulation',
						message: 'Voulez-vous vraiment annuler cette commande ?',
						textConfirm: 'Confirmer',
						textCancel: 'Annuler',
					}
				},
				response: (res: boolean) => {
					if (res) {
						setTimeout(async () => {
							await cancelOrder($userStore.uid, data.uid);
							await invalidate('/orders');
							modalStore.clear();
							toastStore.trigger({ ...toastSuccess, message: `Votre commande a bien été annulé`, timeout: 5000, hideDismiss: true });
						}, 1000);
					} else {
						modalStore.clear();
					}
				}
			});
		});
	};

	const handleConfirm = (order: OrderType) => {
		modalStore.trigger({
			backdropClasses: 'w-screen',
			type: 'component',
			component: {
				ref: ConfirmOrder,
				props: {
					order: order
				}
			}
		});
	}
</script>

<div class="inline-block bg-white rounded-2xl shadow-md pr-5 pl-4 py-5">
	<div class="flex items-center justify-between">
		<p class="text-slate-800 font-semibold text-lg">Commande n° { data.uid.substring(10).toUpperCase() }</p>
		{#if status === OrderEnum.PENDING}
			<button type="button" on:click={handleCancel}
							class="text-3xl relative text-slate-500 hover:text-white left-1.5 h-8 w-8 bg-slate-200 hover:bg-pink-600 rounded-full transition-colors duration-300 font-medium flex items-center justify-center">
				<span class="relative -top-[1px]">×</span>
			</button>
		{/if}
	</div>
	<p class="text-sm text-slate-500 font-medium">{ created }</p>
	<p class="mt-3 text-slate-800 font-medium">Statut
		: {status === 'pending' ? 'En attente de confirmation' : 'En livraison'}</p>
	{#if (status === OrderEnum.IN_DELIVERY) && (data.deliveryman && data.deliveryman.firstname)}
		<p class="text-slate-800 font-medium">Livreur : { data.deliveryman.firstname.toCapitalize() }</p>
	{/if}
	<div class="h-0.5 bg-slate-200 w-full my-3"/>
	<div class="flex flex-col">
		{#each data.restaurants as restaurant}
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
	<p class="text-slate-800 font-semibold flex justify-end text-lg">TOTAL : { data.totalPrice.toFixed(2) } €</p>
	<div class="flex justify-start">
		{#if status === 'in_delivery'}
			<a href="/orders/track?order={data.uid}"
							class="mt-5 bg-slate-500 hover:bg-slate-600 transition-colors duration-300 px-4 py-1.5 font-bold rounded-lg text-sm text-white inline-flex items-stretch">
				Suivre la livraison
			</a>
		{/if}
		{#if status === 'pending'}
			<button on:click={() => handleConfirm(data)} type="button"
							class="mt-5 bg-pink-600 hover:bg-pink-700 transition-colors duration-300 px-4 py-1.5 font-bold rounded-lg text-sm text-white inline-flex items-stretch">
				Confirmer la commande
			</button>
		{/if}
	</div>
</div>
