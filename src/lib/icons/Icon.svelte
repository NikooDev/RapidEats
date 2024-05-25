<script lang="ts">
	export let height = 24;
	export let width = 24;
	export let viewBox = '0 0 24 24';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} height={height} width={width} fill="currentColor">
	<slot/>
</svg>
