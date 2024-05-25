<script lang="ts">
	import { useUsersStore } from '$lib/stores/user';

	const { userStore } = useUsersStore();

	console.log('okok');
</script>

<svelte:head>
	<title>Rapid Eats | Mon compte</title>
</svelte:head>

<div>
	{ $userStore.firstname }
</div>
