<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Loading } from '$lib';

	export let title: string | undefined
	export let message: string;
	export let textConfirm: string;
	export let textCancel: string;

	$: loading = false;

	const modalStore = getModalStore();

	const handleConfirm = () => {
		loading = true;
		$modalStore[0].response(true);
	}

	const handleCancel = () => {
		$modalStore[0].response(false);
	}
</script>

<div class="bg-white shadow-md rounded-2xl overflow-hidden w-[30rem] max-w-full fixed py-3 px-4">
	<h1 class="flex items-center justify-between text-pink-600 font-bold text-lg uppercase mb-5">
		<span>{ title }</span>
		{#if loading}
			<span>
				<Loading height={24} width={24} color="text-white" fill="fill-pink-600"/>
			</span>
		{/if}
	</h1>
	<p class="text-slate-800 font-medium text-lg">{ message }</p>
	<div class="h-0.5 bg-slate-200 w-full mb-3 mt-3"/>
	<div class="flex justify-around">
		<button type="button" disabled={loading} on:click={handleCancel} class="text-white font-medium bg-slate-500 hover:bg-slate-600 disabled:bg-slate-500 transition-colors duration-300 rounded-lg focus:outline-0 px-10 py-1.5">{ textCancel }</button>
		<button type="button" disabled={loading} on:click={handleConfirm} class="text-white font-medium bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600 transition-colors duration-300 rounded-lg focus:outline-0 px-10 py-1.5">{ textConfirm }</button>
	</div>
</div>
