<script lang="ts">
	import { page } from '$app/stores';
	import { Loading } from '$lib';
	import { Icon, Hamburger, Poi, Map, Cart, Back } from '$lib/icons';
	import { modalLogin, modalSignup } from '$lib/config/modal';
	import { drawerLeft, drawerRight } from '$lib/config/drawer';
	import { useSettingsStore } from '$lib/stores/app';
	import { derived, writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { useAuthStore } from '$lib/stores/auth';
	import { useUsersStore } from '$lib/stores/user';
	import { onDestroy } from 'svelte';
	import { afterNavigate, beforeNavigate, invalidate, onNavigate } from '$app/navigation';
	import Search from '$lib/components/Search.svelte';
	import MenuUsers from '$lib/components/partials/menus/MenuUsers.svelte';
	import { type DrawerStore, type ModalStore, type PopupSettings, type ToastStore } from '@skeletonlabs/skeleton';
	import { totalCart } from '$lib/stores/order';

	export let drawer: DrawerStore;
	export let modal: ModalStore;
	export let toast: ToastStore;

	const authStore = useAuthStore();
	const { userStore } = useUsersStore();
	const { settingsStore } = useSettingsStore();
	const pageLoading = writable(false);

	let showMaps = true;
	let popupUserState = false;

	onNavigate(() => {
		pageLoading.set(true);
	});

	beforeNavigate(() => {
		pageLoading.set(true);
	});

	afterNavigate(() => {
		setTimeout(() => pageLoading.set(false), 500);
	});

	const popupUser: PopupSettings = {
		event: 'click',
		target: 'popupUser',
		placement: 'bottom',
		middleware: {
			offset: 20
		},
		state: (e: Record<string, boolean>) => {
			popupUserState = e.state;
		}
	};

	const currentPath = derived(page, page => page.url.pathname);

	const unsubscribeSettings = settingsStore.subscribe((value) => {
		localStorage.setItem('settings', JSON.stringify({ maps: value.maps }));
		showMaps = value.maps;
	});

	onDestroy(() => {
		unsubscribeSettings();
		pageLoading.set(false);
	});
</script>

<header class="fixed w-full top-0 left-0 z-20">
	<nav class="h-16 backdrop-blur-[10px] shadow-md">
		<div class="px-5 sm:px-10 w-screen">
			<div class="flex items-center h-16">
				<ul class="flex items-center mr-auto pr-5 shrink-0">
					<li class="mr-5">
						<a href="/" on:click|preventDefault={() => drawer.open({ ...drawerLeft })} class="flex items-center justify-center bg-pink-600 hover:bg-pink-700 transition-all duration-300 h-10 w-10 text-white rounded-full active:scale-[0.9]" role="button" aria-label="Menu">
							{#if $pageLoading}
								<div transition:fade={{duration: 300}} class="h-8 w-8 absolute flex justify-center items-center">
									<Loading height={24} width={24} color="text-white" fill="fill-pink-600"/>
								</div>
							{:else}
								<div transition:fade={{duration: 300}}>
									<Icon viewBox={'0 0 512 512'} height={18} width={18}>
										<Hamburger/>
									</Icon>
								</div>
							{/if}
						</a>
					</li>
					{#if $currentPath !== '/'}
						<li class="flex">
							<button on:click|preventDefault={() => window.history.back()} class="text-slate-800 hover:text-pink-600 transition-colors duration-300 h-10 w-10 flex justify-center items-center">
								<Icon>
									<Back/>
								</Icon>
							</button>
						</li>
					{/if}
					<li>
						<a href="/" class="bg-white bg-opacity-50 hover:bg-slate-200 hover:bg-opacity-80 transition-colors duration-300 px-3 py-2 rounded-3xl text-slate-800 font-medium text-[1.2rem]">Rapid <span class="font-bold text-pink-600">Eats</span></a>
					</li>
				</ul>
				<div class="bg-white bg-opacity-50 px-3 py-2 rounded-3xl hidden md:flex items-center text-slate-800 mr-5">
					<Icon height={20} width={20}>
						<Poi/>
					</Icon>
					<span class="ml-1 font-semibold text-sm text-slate-800">Vannes</span>
				</div>
				<Search classNames="hidden sm:flex"/>
				<div class="flex sm:mr-auto">
					{#if $currentPath === '/'}
						<div transition:fade={{duration: 200}} class="mr-1.5 sm:flex hidden">
							<button on:click={() => settingsStore.update(settings => ({ ...settings, maps: !settings.maps }))} on:click={() => invalidate('/')} class="relative { showMaps ? 'text-pink-600' : 'text-slate-800' } p-2.5 w-10 h-10 flex bg-white bg-opacity-50 hover:bg-slate-200 hover:bg-opacity-80 transition-colors duration-300 justify-center items-center rounded-full">
								<Icon height={20} width={20}>
									<Map/>
								</Icon>
							</button>
						</div>
					{/if}
					{#if !$userStore || $userStore.role === 'customer'}
						<div class="flex mr-3">
							<button on:click|preventDefault={() => drawer.open({ ...drawerRight })} class="relative text-slate-800 p-2.5 w-10 h-10 bg-white bg-opacity-50 hover:bg-slate-200 hover:bg-opacity-80 transition-colors duration-300 flex justify-center items-center rounded-full">
								<Icon height={20} width={20}>
									<Cart/>
								</Icon>
								<span class="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 bg-pink-600 text-white rounded-[30px] text-sm font-semibold leading-5">
									{ $totalCart }
								</span>
							</button>
						</div>
					{/if}
				</div>
				{#if $authStore && $userStore}
					<MenuUsers user={$userStore} popupUserState={popupUserState} toast={toast} popupUser={popupUser}/>
				{:else}
					<ul class="hidden lg:flex gap-2 ml-5">
						<li>
							<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalLogin)} data-sveltekit-preload-data="hover" class="btn py-1.5 bg-slate-200 hover:bg-slate-300 transition-all duration-300 w-full rounded-lg text-slate-800 font-medium active:scale-[0.9]">Se connecter</a>
						</li>
						<li>
							<a href="/" on:click={() => drawer.close()} on:click|preventDefault={() => modal.trigger(modalSignup)} data-sveltekit-preload-data="hover" class="btn py-1.5 bg-pink-600 hover:bg-pink-700 transition-all duration-300 w-full rounded-lg text-white font-medium active:scale-[0.9]">Créer un compte</a>
						</li>
					</ul>
				{/if}
			</div>
		</div>
	</nav>
</header>
