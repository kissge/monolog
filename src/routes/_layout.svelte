<script lang="ts">
  import Nav from '../components/Nav.svelte';

  export let segment: string;
</script>

<Nav {segment} />

<main>
  <slot />
</main>

<style>
  main {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 32px;
    max-width: 56em;
  }
</style>
