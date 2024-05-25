<script lang="ts">
	import '$lib/assets/app.css';
	import '$lib/helpers/serialize';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Cart, Header, Login, Navigation, Signup } from '$lib';
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import {
		initializeStores, getDrawerStore,
		getModalStore, getToastStore, storePopup,
		type ModalComponent, Modal, Drawer, Toast, type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { subscribeModal } from '$lib/config/modal';
	import { subscribeDrawer } from '$lib/config/drawer';
	import { useSettingsStore } from '$lib/stores/app';
	import { useAuthStore } from '$lib/stores/auth';
	import { toastError } from '$lib/config/toast';

	if (browser) {
		initializeStores();
		storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	}

	const authStore = useAuthStore();
	const { settingsStore } = useSettingsStore();

	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const unsubscribeModal = subscribeModal(modalStore);
	const unsubscribeDrawer = subscribeDrawer(drawerStore);

	const isPageError = $page.error && $page.error.message.length > 0;
	if (isPageError) document.title = 'Rapid Eats | Erreur';

	if (browser) {
		authStore.subscribe((auth) => {
			let authToast: ToastSettings;

			if (auth) {
				if (auth.expired) {
					authToast = { ...toastError, message: 'Votre session a expiré.\nVeuillez vous reconnecter.', autohide: false };
					toastStore.trigger(authToast);
				}
			}
		});
	}

	onDestroy(() => {
		unsubscribeModal();
		unsubscribeDrawer();
	});

	const modalRegistry: Record<string, ModalComponent> = {
		modalLogin: { ref: Login, props: { toast: toastStore, modal: modalStore } },
		modalSignup: { ref: Signup, props: { toast: toastStore, modal: modalStore } }
	}
</script>

{#if $settingsStore.overlay}
	<div transition:fade={{duration: 200}} class="fixed h-screen w-screen bg-black bg-opacity-50 z-30"/>
{/if}

{#if isPageError}
	<p>Error page {$page.error.message}</p>
{:else}
	<Toast rounded="rounded-lg" position="t" padding="py-3 px-5" zIndex="z-[1000]" buttonDismiss="text-[.9rem] hover:text-pink-600 text-slate-800 transition-colors duration-300" buttonDismissLabel="Fermer"/>

	<Header drawer={drawerStore} modal={modalStore} toast={toastStore}/>

	<Drawer>
		{#if $drawerStore.id === 'navigation'}
			<Navigation drawer={drawerStore} modal={modalStore}/>
		{:else if $drawerStore.id === 'cart'}
			<Cart drawer={drawerStore} modal={modalStore}/>
		{/if}
	</Drawer>

	<main class="pt-16 z-0 relative">
		<slot/>
	</main>

	<Modal components={modalRegistry} transitionIn={fade} transitionOut={fade}/>
{/if}
