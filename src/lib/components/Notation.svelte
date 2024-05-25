<script lang="ts">
	import { Ratings } from '@skeletonlabs/skeleton';
	import { Icon, Stars, StarsOutline } from '$lib/icons';

	export let note: number;
</script>

<div class="flex items-center">
	<Ratings value={note} max={5} spacing="space-x-1">
		<svelte:fragment slot="empty">
			<span class="text-slate-800">
				<Icon height={18} width={18}>
					<StarsOutline/>
				</Icon>
			</span>
		</svelte:fragment>
		<svelte:fragment slot="half">
			<span class="text-yellow-500">
				<Icon height={18} width={18}>
					<Stars/>
				</Icon>
			</span>
		</svelte:fragment>
		<svelte:fragment slot="full">
			<span class="text-yellow-500">
				<Icon height={18} width={18}>
					<Stars/>
				</Icon>
			</span>
		</svelte:fragment>
	</Ratings>
	<span class="flex w-full ml-2 relative top-[1px] text-slate-800 font-semibold text-sm">{ note }</span>
</div>
