<script lang="ts">
  import GoogleAnalytics from 'sapper-google-analytics/GoogleAnalytics.svelte';
  import { stores } from '@sapper/app';
  import Nav from '../components/Nav.svelte';
  import { config } from '../config';

  export let segment: string;
</script>

<svelte:head>
  {#if config.googleAnalyticsTrackingID}
    <GoogleAnalytics {stores} id={config.googleAnalyticsTrackingID} />
  {/if}
  {#if config.twitter}
    <link href="https://twitter.com/{config.twitter}" rel="me" />
    <link rel="webmention" href="https://webmention.io/{config.host.split('//')[1]}/webmention" />
    <link rel="pingback" href="https://webmention.io/{config.host.split('//')[1]}/xmlrpc" />
  {/if}
</svelte:head>

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
