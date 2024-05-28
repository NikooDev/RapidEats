<script lang="ts">
	export let error = false;
</script>

<div class="bg-white shadow-md rounded-2xl overflow-hidden w-[35rem] max-w-full fixed { error && 'animate-shake' }" id="modal">
	<div class="flex flex-col justify-center items-center w-full">
		<slot/>
	</div>
</div>
