<script lang="ts">
	import { logout } from '$lib/actions/auth';
	import { popup } from '@skeletonlabs/skeleton';
	import { Help, Icon, Order, Signout, Ticket, User, UserCircle } from '$lib/icons';
	import { RoleEnum, type UsersType } from '$lib/interfaces/user';
	import type { PopupSettings, ToastStore } from '@skeletonlabs/skeleton';

	export let user: UsersType;
	export let popupUserState: boolean;
	export let toast: ToastStore;
	export let popupUser: PopupSettings;

	const isCustomer = user.role === RoleEnum.CUSTOMER;
	const isRestaurant = user.role === RoleEnum.RESTAURANT;
	const isDeliveryman = user.role === RoleEnum.DELIVERYMAN;
</script>

<button class="flex items-center justify-between rounded-3xl p-2 w-10 md:ml-3 sm:ml-0 ml-0 md:w-auto h-10 {popupUserState ? 'text-white bg-pink-600 hover:bg-pink-600 hover:bg-opacity-100' : 'text-slate-800 hover:bg-slate-200 hover:bg-opacity-80' } transition-colors duration-200" use:popup={popupUser}>
	<span class="font-medium text-[1rem] mr-2 hidden md:inline-block pl-3 max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
		{#if isCustomer || isDeliveryman}
			{ user.firstname.toCapitalize() }
		{:else}
			{ user.title.toCapitalize() }
		{/if}
	</span>
	<Icon height={28} width={28}>
		<User/>
	</Icon>
</button>
<div class="absolute" data-popup="popupUser">
	<div class="flex flex-col gap-2 bg-white rounded-lg w-72 shadow-center py-3 z-20">
		{#if isRestaurant}
			<div class="flex">
				<p class="text-sm text-pink-600 font-bold px-4 uppercase">Compte restaurant</p>
			</div>
		{/if}
		{#if isDeliveryman}
			<div class="flex">
				<p class="text-sm text-pink-600 font-bold px-4 uppercase">Compte livreur</p>
			</div>
		{/if}
		<div class="flex">
			<a href="/account" class="flex items-center px-4 group py-2 font-medium text-slate-800 w-full hover:bg-pink-600 hover:text-white transition-colors duration-200">
				<Icon height={50} width={50}>
					<UserCircle/>
				</Icon>
				<div class="flex flex-col">
					<span class="ml-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-48">
						{#if isCustomer}
							{ user.firstname.toCapitalize() + ' ' + user.lastname.toCapitalize() }
						{/if}
						{#if isRestaurant}
							{ user.title.toCapitalize() }
						{/if}
						{#if isDeliveryman}
							{ user.firstname.toCapitalize() }
						{/if}
					</span>
					<span class="ml-2 font-medium text-sm text-pink-600 group-hover:text-white transition-colors duration-200">Gérer le compte</span>
				</div>
			</a>
		</div>
		<div class="flex">
			<a href="/orders" class="flex px-4 py-2 font-medium text-slate-800 w-full hover:bg-pink-600 hover:text-white transition-colors duration-200">
				<Icon height={24} width={24}>
					<Order/>
				</Icon>
				<span class="ml-3">Mes commandes</span>
			</a>
		</div>
		{#if isCustomer}
			<div class="flex">
				<a href="/promotions" class="flex px-4 py-2 font-medium text-slate-800 w-full hover:bg-pink-600 hover:text-white transition-colors duration-200">
					<Icon height={24} width={24}>
						<Ticket/>
					</Icon>
					<span class="ml-3">Promotions</span>
				</a>
			</div>
		{/if}
		<div class="h-0.5 bg-slate-200 w-full my-0.5"/>
		<div class="flex">
			<a href="/help" class="flex px-4 py-2 font-medium text-slate-800 w-full hover:bg-pink-600 hover:text-white transition-colors duration-200">
				<Icon height={24} width={24}>
					<Help/>
				</Icon>
				<span class="ml-3">Aide</span>
			</a>
		</div>
		<form class="flex w-full" method="POST" action="/api/auth?/logout" on:submit|preventDefault={(event) => logout(event, toast)}>
			<button type="submit" class="flex pl-[1.1rem] pr-4 py-2 font-medium text-slate-800 w-full hover:bg-pink-600 hover:text-white transition-colors duration-200">
				<Icon height={24} width={24}>
					<Signout/>
				</Icon>
				<span class="ml-3">Déconnexion</span>
			</button>
		</form>
	</div>
	<div class="arrow-container">
		<div class="arrow bg-surface-100-800-token"/>
		<div class="arrow-shadow"/>
	</div>
</div>
