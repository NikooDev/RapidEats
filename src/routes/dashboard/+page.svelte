<script lang="ts">
	import { setCustomers, useUsersStore } from '$lib/stores/user';
	import { onDestroy, onMount } from 'svelte';
	import { getCustomers } from '$lib/firebase/client';
	import { Loading } from '$lib';

	const { customersStore, restaurantsStore, deliverymansStore } = useUsersStore();

	$: loading = true;

	onMount(async () => {
		const customers = await getCustomers();

		setCustomers(customers);
		loading = false;
	});

	onDestroy(() => {
		loading = true;
	});
</script>

<div class="container mx-auto px-5 mt-10 pb-10">
	{#if loading}
		<div class="flex justify-center items-center mt-52">
			<Loading height={50} width={50} color="text-white" fill="fill-pink-600"/>
		</div>
	{/if}
	{#if !loading}
		<div>
			<div>
				<h2 class="text-pink-600 font-bold mb-2 mt-3 text-lg">Liste des clients</h2>
				<table class="table table-fixed border-spacing-3 shadow-md rounded-2xl overflow-hidden">
					<thead class="!border-0">
						<tr class="bg-slate-800">
							<th class="!font-semibold text-white">Nom</th>
							<th class="!font-semibold text-white">Email</th>
							<th class="!font-semibold text-white">Rôle</th>
							<th class="!font-semibold text-white !whitespace-nowrap text-ellipsis overflow-hidden">Commandes en cours et terminées</th>
						</tr>
					</thead>
					<tbody>
						{#each $customersStore as customer, index}
							<tr class="!border-0 shadow-md {index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} !text-slate-800 hover:!bg-pink-600 hover:!text-white duration-200 transition-colors">
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ customer.firstname.toCapitalize() } { customer.lastname.toCapitalize() }
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ customer.email }
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ customer.admin ? 'Admin' : 'Client' }
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ customer.orders.length }
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-8">
				<h2 class="text-pink-600 font-bold mb-2 mt-3 text-lg">Liste des restaurants</h2>
				<table class="table table-fixed border-spacing-3 shadow-md rounded-2xl overflow-hidden">
					<thead class="!border-0">
						<tr class="bg-slate-800">
							<th class="!font-semibold text-white">Nom</th>
							<th class="!font-semibold text-white">Rôle</th>
							<th class="!font-semibold text-white">Lien</th>
							<th class="!font-semibold text-white">Menus</th>
						</tr>
					</thead>
					<tbody>
						{#each $restaurantsStore as restaurant, index}
							<tr class="!border-0 shadow-md {index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} !text-slate-800 hover:!bg-pink-600 hover:!text-white duration-200 transition-colors">
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ restaurant.title.toCapitalize() }
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									Restaurant
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									<a href="/{ restaurant.slug }" class="flex">Lien</a>
								</td>
								<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
									{ restaurant.menus.length }
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-8">
				<h2 class="text-pink-600 font-bold mb-2 mt-3 text-lg">Liste des livreurs</h2>
				<table class="table table-fixed border-spacing-3 shadow-md rounded-2xl overflow-hidden">
					<thead class="!border-0">
					<tr class="bg-slate-800">
						<th class="!font-semibold text-white">Nom</th>
						<th class="!font-semibold text-white">Email</th>
						<th class="!font-semibold text-white">Rôle</th>
						<th class="!font-semibold text-white !whitespace-nowrap text-ellipsis overflow-hidden">Commandes livrées</th>
					</tr>
					</thead>
					<tbody>
					{#each $deliverymansStore as deliveryman, index}
						<tr class="!border-0 shadow-md {index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} !text-slate-800 hover:!bg-pink-600 hover:!text-white duration-200 transition-colors">
							<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
								{ deliveryman.firstname.toCapitalize() }
							</td>
							<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
								{ deliveryman.email }
							</td>
							<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
								Livreur
							</td>
							<td class="!px-5 !text-base !font-medium !whitespace-nowrap text-ellipsis overflow-hidden">
								{ deliveryman.orders.length }
							</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

