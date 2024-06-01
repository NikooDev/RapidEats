<script lang="ts">
	import Masonry from 'svelte-bricks';
	import OrderCard from '$lib/components/app/order/OrderCard.svelte';
	import type { OrderType } from '$lib/interfaces/order';

	export let ordersInDelivery: OrderType[];
</script>

<div class="mt-7">
	{#if ordersInDelivery.length > 0}
		<div class="flex justify-center mb-7">
			<h2 class="text-pink-600 font-bold text-lg uppercase">Commandes en livraison</h2>
		</div>
		<Masonry idKey="uid" class="!justify-start" items={ordersInDelivery} minColWidth={300} maxColWidth={500} gap={20} animate={false} let:item>
			<OrderCard data={item} status="in_delivery"/>
		</Masonry>
	{/if}
</div>
