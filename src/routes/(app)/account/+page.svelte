<script lang="ts">
	import { onMount } from 'svelte';
	import { useUsersStore } from '$lib/stores/user';
	import Masonry from 'svelte-bricks';
	import Profile from '$lib/components/app/account/Profile.svelte';
	import Historic from '$lib/components/app/account/Historic.svelte';
	import Address from '$lib/components/app/account/Address.svelte';

	const { userStore } = useUsersStore();
	const dashboard = [{ uid: 1, component: Profile }, { uid: 2, component: Address }];
	const historic = [{ uid: 1, component: Historic }];

	let dashboardRef: number;

	onMount(() => {
		const col = document.querySelectorAll('.col') as NodeListOf<HTMLDivElement>;
		dashboardRef = col[0].clientWidth * 2 + 20;

		window.addEventListener('resize', () => {
			const col = document.querySelectorAll('.col') as NodeListOf<HTMLDivElement>;
			dashboardRef = col[0].clientWidth * 2 + 20;
		})
	})
</script>

<svelte:head>
	<title>Rapid Eats | Mon compte</title>
</svelte:head>

<div class="container mx-auto pt-10 px-5">
	<div class="flex w-full pb-5">
		<Masonry idKey="uid" class="w-full" items={dashboard} minColWidth={350} gap={20} animate={false} let:item>
			<div class="flex w-full bg-white shadow-md rounded-2xl px-4 py-3">
				<svelte:component this={item.component} users={$userStore}/>
			</div>
		</Masonry>
	</div>
	<div>
		<Masonry idKey="uid" class="w-full" items={historic} minColWidth={900} maxColWidth={dashboardRef && dashboardRef} gap={20} animate={false} let:item>
			<div class="flex w-full bg-white shadow-md rounded-2xl px-4 py-3">
				<svelte:component this={item.component} users={$userStore}/>
			</div>
		</Masonry>
	</div>
</div>
