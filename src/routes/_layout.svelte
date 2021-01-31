<script lang="ts">
  import GoogleAnalytics from 'sapper-google-analytics/GoogleAnalytics.svelte';
  import { stores } from '@sapper/app';
  import Nav from '../components/Nav.svelte';
  import { config } from '../config';

  export let segment: string;
</script>

{#if config.googleAnalyticsTrackingID}
  <GoogleAnalytics {stores} id={config.googleAnalyticsTrackingID} />
{/if}
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
