<script lang="ts">
	import Masonry from 'svelte-bricks';
	import OrderCard from '$lib/components/app/order/OrderCard.svelte';
	import type { OrderType } from '$lib/interfaces/order';

	export let ordersPending: OrderType[];
</script>

<div class="mt-7">
	{#if ordersPending.length > 0}
		<div class="flex justify-center mb-7">
			<h2 class="text-pink-600 font-bold text-lg uppercase">Commandes en attente</h2>
		</div>
		<Masonry idKey="uid" class="!justify-start" items={ordersPending} minColWidth={300} maxColWidth={500} gap={20} animate={false} let:item>
			<OrderCard data={item} status="pending"/>
		</Masonry>
	{/if}
</div>
