<script lang="ts">
	import { useAuthStore } from '$lib/stores/auth';
	import { useUsersStore } from '$lib/stores/user';
	import { cartStore, totalCart } from '$lib/stores/order';
	import { Cart, Icon } from '$lib/icons';
	import { type CartMenuType, OrderEnum, type OrderGrouped, type OrderType } from '$lib/interfaces/order';
	import type { DrawerStore, ModalStore, ToastStore } from '@skeletonlabs/skeleton';
	import { modalLogin } from '$lib/config/modal';
	import { addOrders, getOrder, getPositionRestaurant } from '$lib/firebase/client';
	import { goto } from '$app/navigation';
	import { Loading } from '$lib';
	import { toastError, toastSuccess } from '$lib/config/toast';
	import { onMount } from 'svelte';

	const authStore = useAuthStore();
	const { userStore } = useUsersStore();

	export let drawer: DrawerStore;
	export let modal: ModalStore;
	export let toast: ToastStore

	$: loading = false;

	$: groupedCart = Object.values($cartStore).reduce((acc: Record<string, OrderGrouped>, c: CartMenuType) => {
		if (!acc[c.restaurantUID]) {
			acc[c.restaurantUID] = { restaurantTitle: c.restaurantTitle, restaurantUID: c.restaurantUID, items: [] } as OrderGrouped;
		}
		acc[c.restaurantUID].items.push(c);
		return acc;
	}, {});

	$: totalPrices = Object.values(groupedCart).map(restaurant => {
		const totalPrice = restaurant.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);
		return { restaurantTitle: restaurant.restaurantTitle, totalPrice };
	});

	onMount(async () => {

	})

	const addMenu = (uid: string) => {
		cartStore.update(cart => {
			if (cart[uid]) {
				if (cart[uid].quantity < 20) {
					cart[uid].quantity += 1;
				}
			}

			return cart;
		});
	};

	const removeMenu = (uid: string) => {
		cartStore.update(cart => {
			if (cart[uid]) {
				cart[uid].quantity -= 1;

				if (cart[uid].quantity <= 0) {
					delete cart[uid];
				}
			}

			return cart;
		});
	}

	const handleOrders = async () => {
		if ($authStore && $userStore) {
			if (Object.keys(groupedCart).length === 0) {
				console.error("Le panier est vide!");
				return;
			}

			loading = true;
			toast.clear();

			const ordersLength = (await Promise.all($userStore.orders.map(async refOrder => {
				return await getOrder($userStore.uid, refOrder, true);
			}))).filter(item => item !== null).length;

			if (ordersLength >= 5) {
				toast.trigger({ ...toastError, message: 'Vous avez atteint la limite de commande en livraison.\n\nVeuillez finaliser vos commandes dans\nMes commandes > Suivre la livraison', timeout: 7000, hideDismiss: true })
				loading = false;
				return;
			}



			const restaurantOrders = await Promise.all(Object.values(groupedCart).map(async (restaurantData) => {
				const { latitude, longitude } = await getPositionRestaurant(restaurantData.restaurantUID);

				return ({
					restaurantUID: restaurantData.restaurantUID,
					title: restaurantData.restaurantTitle,
					latitude,
					longitude,
					menus: restaurantData.items.map(item => ({
						uid: item.uid,
						title: item.title,
						price: item.price,
						quantity: item.quantity,
					})),
				})
			}));

			const totalPrice = totalPrices.reduce((total, restaurant) => total + restaurant.totalPrice, 0).toFixed(2);

			const order = {
				restaurants: restaurantOrders,
				status: OrderEnum.PENDING,
				totalPrice: parseFloat(totalPrice),
				created: new Date(),
			} as OrderType;

			await addOrders($userStore.uid, $userStore.role, order).then(() => {
				drawer.close();
				setTimeout(async () => {
					cartStore.set({});
					localStorage.removeItem('cart');
					toast.trigger({ ...toastSuccess, message: 'Votre commande a bien été prise en compte', timeout: 5000, hideDismiss: true });
					await goto('/orders');
				}, 200)
			});
		} else {
			drawer.close();
			setTimeout(() => modal.trigger(modalLogin), 200);
		}
	}
</script>

<aside class="flex flex-col h-full">
	<div class="sticky top-0 bg-white w-full h-14 z-10">
		<h2 class="text-center py-4 text-slate-800 font-medium text-2xl">Panier {$totalCart === 0 ? '' : $totalCart > 1 ? `${$totalCart} articles` : `${$totalCart} article`}</h2>
	</div>
	<div class="w-full mt-5 h-full flex flex-col">
		{#if Object.values(groupedCart).length > 0}
			{#each Object.values(groupedCart) as restaurant, index}
				<div class="relative px-2">
					<h2 class="text-pink-600 font-bold text-lg {index === 0 ? 'mt-0' : 'mt-5'} mb-3">{restaurant.restaurantTitle}</h2>
					{#each restaurant.items as item, index}
						<div class="flex items-center w-full">
							<div class="flex items-center">
								<p class="text-slate-800 font-semibold w-10 text-2xl">{ item.quantity }</p>
								<p class="text-slate-800 font-semibold capitalize">{ item.title }</p>
							</div>
							<div class="flex-grow flex justify-end whitespace-nowrap">
								<p>{ item.price.toFixed(2) } €</p>
							</div>
						</div>
						<div class="flex justify-end gap-3 mt-3">
							<button on:click={() => addMenu(item.uid)}
											class="bg-white shadow-md rounded-full text-slate-800 focus:outline-0 text-3xl border-2 border-white hover:border-pink-600 font-medium h-10 w-10 flex justify-center items-center transition-all duration-300 group-hover:text-pink-600">
								+
							</button>

							<button on:click={() => removeMenu(item.uid)}
											class="bg-white shadow-md rounded-full text-slate-800 focus:outline-0 text-3xl border-2 border-white hover:border-pink-600 font-medium h-10 w-10 flex justify-center items-center transition-all duration-300 group-hover:text-pink-600">
								{item.quantity === 1 ? '×' : '-'}
							</button>
						</div>
						{#if index !== restaurant.items.length - 1}
							<div class="h-0.5 bg-slate-200 w-full mt-5 mb-3"></div>
						{/if}
					{/each}

					<p class="text-slate-600 font-semibold text-sm justify-end w-full flex mt-5">Sous-total : {totalPrices[index].totalPrice.toFixed(2)} €</p>
				</div>
			{/each}
			<div class="sticky flex mt-auto bg-white w-full bottom-0 pb-1">
				<div class="flex justify-between items-center w-full pt-3 pb-2">
					<button disabled={loading} on:click={handleOrders} class="bg-pink-600 font-bold text-sm uppercase hover:bg-pink-700 disabled:hover:bg-pink-600 transition-all duration-300 text-white px-5 flex justify-center items-center h-[42px] rounded-2xl">
						{#if loading}
							<Loading height={24} width={24}/>
						{:else}
							Commander
						{/if}
					</button>
					<p class="text-pink-600 font-semibold text-lg text-right">TOTAL : {totalPrices.reduce((total, restaurant) => total + restaurant.totalPrice, 0).toFixed(2)} €</p>
				</div>
			</div>
		{:else}
			<div class="w-full flex flex-col justify-center items-center text-slate-500 mt-36">
				<Icon height={80} width={80}>
					<Cart/>
				</Icon>
				<p class="text-slate-800 font-bold text-2xl mt-3">Aucun article</p>
				<p class="text-slate-800 font-medium mt-2 text-center">Ajoutez les articles d'un restaurant pour commencer un nouveau panier.</p>
			</div>
		{/if}
	</div>
</aside>
