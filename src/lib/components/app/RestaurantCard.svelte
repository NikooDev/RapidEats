<script lang="ts">
	import type { RestaurantType } from '$lib/interfaces/user';
	import { Notation } from '$lib';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	export let data: RestaurantType;
</script>

<a href="/" on:click|preventDefault={() => goto('/'+data.slug)} in:fade={{ duration: 300 }} class="flex flex-col justify-center h-fit bg-white shadow-md rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
	<div class="h-[12rem] w-full overflow-hidden">
		<img src={data.coverURL} class="object-cover h-full w-full scale-[1] group-hover:scale-[1.1] transition-all duration-300" alt={data.title}/>
	</div>
	<div class="py-3 px-4 h-full flex flex-col">
		<p class="font-bold text-lg text-slate-800">{ data.title.toCapitalize() }</p>
		<p class="font-medium text-slate-800 text-sm mt-2">{ data.description.toCapitalize() }</p>
		<div class="flex mt-3 justify-end">
			<Notation note={data.note}/>
		</div>
	</div>
</a>
