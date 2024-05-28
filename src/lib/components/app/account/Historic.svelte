<script lang="ts">
	import { Icon, Order } from '$lib/icons';
	import type { UsersType } from '$lib/interfaces/user';

	export let users: UsersType;
</script>


<div class="flex flex-col w-full items-center">
	<h2 class="text-slate-800 text-lg font-semibold flex items-center">
		<Icon height={22} width={22}>
			<Order/>
		</Icon>
		<span class="ml-2.5">Historique des commandes</span>
	</h2>
	<div class="mt-5 flex flex-col w-full items-center text-center">
		<p class="text-slate-800 font-bold">Aucune commande pour le moment</p>
		<p class="text-slate-800 font-medium text-sm">Vos commandes terminées s'affichent ici.</p>
	</div>
</div>
