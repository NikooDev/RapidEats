<script lang="ts">
	import { cartStore, totalCart } from '$lib/stores/order';
	import { Cart, Icon } from '$lib/icons';
	import type { CartMenuType } from '$lib/interfaces/order';

	$: groupedCart = Object.values($cartStore).reduce((acc: Record<string, CartMenuType>, c: CartMenuType) => {
		if (!acc[c.restaurantUID]) {
			acc[c.restaurantUID] = { restaurantTitle: c.restaurantTitle, items: [] } as CartMenuType;
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
					<button class="bg-pink-600 font-bold text-sm uppercase hover:bg-pink-700 transition-colors duration-300 text-white px-4 py-2 rounded-2xl">Commander</button>
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
