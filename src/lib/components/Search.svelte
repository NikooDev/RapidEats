<script lang="ts">
	import { getSearchDatas, loadingStore, searchMenuStore, searchStore } from '$lib/firebase/client';
	import { Icon, Hamburger, Search } from '$lib/icons';
	import { Loading, MenuCard } from '$lib';
	import { clickOutside } from '$lib/helpers/outside';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { modalMenu } from '$lib/config/modal';

	export let classNames: string;

	let y: number;
	let search: string = '';

	$: showSearch = false;

	const modalStore = getModalStore();

	const unsubscribeSearch = searchStore.subscribe((value) => {
		showSearch = !!value;
	});

	const resetSearch = () => {
		showSearch = false;
		searchStore.set(null);
		search = '';
	}

	onDestroy(() => {
		showSearch = false;
		searchStore.set(null);
		loadingStore.set(false);
		unsubscribeSearch();
	});
</script>

<svelte:window bind:scrollY={y}/>

<form class="flex max-w-full w-96 mr-5 relative {classNames}" use:clickOutside on:click_outside={() => showSearch = false}>
	<span class="absolute left-3 top-2 text-slate-800">
		<Icon height={20} width={20}>
			<Search/>
		</Icon>
	</span>
	<input type="text" on:focus={() => showSearch = true} on:keyup={getSearchDatas} bind:value={search}
				 class="flex w-full min-w-full { y < 50 ? 'bg-slate-200' : 'bg-white' } transition-colors duration-300 hover:bg-slate-200 bg-opacity-50 hover:bg-opacity-80 rounded-full py-1.5 pr-3.5 pl-10 focus:outline-0 text-[.85rem] text-slate-800 selection:bg-pink-600 selection:text-white font-semibold placeholder:text-slate-800"
				 placeholder="Rechercher dans Rapid Eats">
	{#if $loadingStore}
		<div in:fly out:fly class="absolute top-1.5 right-1.5">
			<Loading height={24} width={24} fill="fill-slate-800" color="{ y < 50 ? 'text-slate-100' : 'text-white' } fill-black transition-colors duration-300"/>
		</div>
	{/if}
	{#if showSearch && $searchStore}
		<div in:fly={{duration: 200}} out:fly={{duration: 200}}
				 class="flex absolute top-[3.6rem] bg-white shadow-center rounded-lg w-full left-1/2 -translate-x-[12rem] min-w-[24rem] overflow-y-auto max-h-72">
			<div class="py-2 px-2 flex flex-col gap-2 rounded-2xl overflow-hidden w-full h-full">
				{#if $searchStore.length === 0 && $searchMenuStore.length === 0}
					<p class="text-slate-800 text-center font-semibold text-base w-full pt-3 pb-3">Aucun résultat</p>
				{:else}
					{#if $searchStore.length > 0}
						<p class="text-sm text-pink-600 font-bold px-2 pt-1 uppercase">Restaurants</p>
						{#each $searchStore as restaurant}
							<a href="/{restaurant.slug}" data-sveltekit-preload-data="tap" on:click={resetSearch}
								 class="flex items-center w-full h-20 hover:bg-slate-200 transition-colors duration-300 rounded-[12px] relative overflow-hidden">
								{#if restaurant.coverURL}
									<img src={restaurant.coverURL} class="object-cover rounded-[12px] w-20 h-20" alt={restaurant.title}/>
								{:else}
									<div class="w-20 h-20 rounded-[12px] bg-white flex justify-center items-center text-pink-600">
										<Icon viewBox="0 0 512 512">
											<Hamburger/>
										</Icon>
									</div>
								{/if}
								<div class="px-5 flex flex-col width-search">
									<p class="text-ellipsis overflow-hidden whitespace-nowrap text-slate-800 text-lg font-bold">{ restaurant.title }</p>
									<p class="text-ellipsis overflow-hidden whitespace-nowrap text-slate-800 text-sm font-semibold">{ restaurant.description }</p>
								</div>
							</a>
						{/each}
					{/if}

					{#if $searchMenuStore.length > 0}
						{#if $searchStore.length !== 0}<div class="bg-slate-200 h-0.5 w-full mt-2"/>{/if}
						<p class="text-sm text-pink-600 font-bold px-2 pt-1 uppercase">Menus</p>
						{#each $searchMenuStore as menu}
							<a href="/" on:click|preventDefault={() => modalStore.trigger({ ...modalMenu, component: { ref: MenuCard, props: { data: menu, type: 'modal', restaurantUID: menu.restaurantUID, restaurantTitle: menu.restaurantTitle } } })}
								 class="flex items-center w-full h-20 hover:bg-slate-200 transition-colors duration-300 rounded-[12px] relative overflow-hidden">
								{#if menu.imageURL}
									<img src={menu.imageURL} class="object-cover rounded-[12px] w-20 h-20" alt={menu.title}/>
								{:else}
									<div class="w-20 h-20 rounded-[12px] bg-white flex justify-center items-center text-pink-600">
										<Icon viewBox="0 0 512 512">
											<Hamburger/>
										</Icon>
									</div>
								{/if}
								<div class="px-5 flex flex-col width-search">
									<p class="text-ellipsis overflow-hidden whitespace-nowrap text-slate-800 text-lg font-bold">{ menu.title }</p>
									<p class="text-ellipsis overflow-hidden whitespace-nowrap text-slate-800 text-sm font-semibold">{ menu.price.toFixed(2) }
										€ • { menu.description }</p>
								</div>
							</a>
						{/each}
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</form>
