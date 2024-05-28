<script>
	import { Icon, Order } from '$lib/icons';
</script>

<svelte:head>
	<title>Rapid Eats | Mes commandes</title>
</svelte:head>

<div class="flex">
	<div class="w-full flex flex-col justify-center items-center text-slate-500 h-[60vh]">
		<Icon height={80} width={80}>
			<Order/>
		</Icon>
		<p class="text-slate-800 font-bold text-2xl mt-3">Aucune commande pour le moment</p>
		<p class="text-slate-800 font-medium mt-2">Lorsque vous passerez une commande, elle s'affichera ici.</p>
		<a href="/" class="flex bg-pink-600 h-11 mt-8 items-center justify-center text-white font-medium px-4 rounded-2xl hover:bg-pink-700 transition-colors duration-300">Trouver un restaurant</a>
	</div>
</div>
