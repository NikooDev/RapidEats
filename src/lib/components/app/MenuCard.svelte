<script lang="ts">
	import type MenuType from '$lib/interfaces/menu';
	import { getModalStore, type ModalComponent } from '@skeletonlabs/skeleton';
	import { modalMenu } from '$lib/config/modal';
	import { MenuCard } from '$lib';
	import { cart } from '$lib/stores/order';

	export let data: MenuType;
	export let type: string;
	const modalStore = getModalStore();

	$: cartStorage = localStorage.getItem('cart') ? Object.values(JSON.parse(localStorage.getItem('cart'))) as MenuType[] & { quantity: number } : {} as MenuType[] & { quantity: number };

	const addMenu = () => {
		let cartExist = JSON.parse(localStorage.getItem('cart')) || {};

		if (cartExist[data.uid]) {
			cartExist[data.uid].quantity += 1;
		} else {
			cartExist[data.uid] = {
				...data,
				quantity: 1
			};
		}


		localStorage.setItem('cart', JSON.stringify(cartExist));
	};

	const removeMenu = () => {
		let cartExist = JSON.parse(localStorage.getItem('cart')) || {};

		if (cartExist[data.uid]) {
			if (cartExist[data.uid].quantity > 1) {
				cartExist[data.uid].quantity -= 1;
			} else {
				delete cartExist[data.uid];
			}

			localStorage.setItem('cart', JSON.stringify(cartExist));
		}
	}

	const modalComponent: ModalComponent = {
		ref: MenuCard,
		props: {
			data,
			type: 'modal'
		}
	};
</script>

{#if type === 'modal'}
	<div class="bg-white shadow-md rounded-2xl w-[25rem] max-w-full fixed" id="modal">
		<div class="absolute bg-white h-10 w-10 z-10 rounded-full -top-3 -right-3 flex justify-center items-center">
			<span class="text-pink-600 font-semibold text-2xl">{ $cart }</span>
		</div>
		<div class="flex flex-col justify-center items-center w-full">
			<div class="w-full h-52 overflow-hidden">
				<img src={data.imageURL}
						 class="w-full h-52 rounded-t-2xl object-cover scale-100 group-hover:scale-[1.1] transition-transform duration-300"
						 alt={data.title}/>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-800 font-bold text-lg mb-3 transition-colors duration-300 group-hover:text-pink-600">{ data.title }</p>
				<p class="text-slate-800 text-base font-medium">{ data.description }</p>
				<div class="flex gap-2 items-center justify-end mt-3 mb-1">
					<span class="mr-1 text-slate-800 font-semibold text-lg">{ data.price.toFixed(2) } €</span>
					<button on:click={addMenu}
									class="bg-white shadow-md rounded-full text-slate-800 focus:outline-0 text-3xl border-2 hover:border-pink-600 font-medium h-10 w-10 flex justify-center items-center transition-all duration-300 group-hover:text-pink-600">
						+
					</button>

					<button on:click={removeMenu}
									class="bg-white shadow-md rounded-full text-slate-800 focus:outline-0 text-3xl border-2 hover:border-pink-600 font-medium h-10 w-10 flex justify-center items-center transition-all duration-300 group-hover:text-pink-600">
						-
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<a href="/" on:click|preventDefault={() => modalStore.trigger({ ...modalMenu, component: modalComponent })}
		 class="w-full bg-white rounded-2xl shadow-md group hover:shadow-lg transition-all duration-300 relative">
		<div class="w-full h-32 overflow-hidden rounded-t-2xl">
			<img src={data.imageURL}
					 class="w-full h-32 object-cover scale-100 group-hover:scale-[1.1] transition-transform duration-300"
					 alt={data.title}/>
		</div>
		<div class="px-4 py-3">
			<p class="text-slate-800 font-bold text-lg mb-3 transition-colors duration-300 group-hover:text-pink-600">{ data.title }</p>
			<p class="text-slate-800 text-base font-medium">{ data.description }</p>
			<div class="flex items-center justify-end mt-3 mb-1">
				<span class="mr-3 text-slate-800 font-semibold text-lg">{ data.price.toFixed(2) } €</span>
				<button
						class="bg-white shadow-md rounded-full text-slate-800 text-3xl font-medium h-10 w-10 flex justify-center items-center transition-colors duration-300 group-hover:text-pink-600">
					{#if cartStorage.length}
					{#each cartStorage as cart}
						{#if cart.uid === data.uid}
							{#if cart.quantity}
								<span class="text-lg text-pink-600 font-semibold">{ cart.quantity }</span>
							{:else}
								+
							{/if}
						{/if}
					{/each}
						{/if}
				</button>
			</div>
		</div>
	</a>
{/if}
