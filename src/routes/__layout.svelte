<script lang="ts">
  import { page } from '$app/stores';
  import { dev } from '$app/env';
  import { initGoogleAdSense, initGoogleAnalytics } from '../components';
  import * as Config from '$lib/config';

  if (!dev) {
    initGoogleAdSense();
    initGoogleAnalytics();
  }

  $: isTop = $page.routeId !== '[...entity]';
</script>

<svelte:head>
  {#if Config.twitterID}
    <link href="https://twitter.com/{Config.twitterID}" rel="me" />
    <link rel="webmention" href="https://webmention.io/{Config.siteHostname}/webmention" />
    <link rel="pingback" href="https://webmention.io/{Config.siteHostname}/xmlrpc" />
  {/if}
  {#if Config.githubID}
    <link href="https://github.com/{Config.githubID}" rel="me" />
  {/if}
  <meta property="og:site_name" content={Config.siteTitle} />
  <link rel="stylesheet" href="/kind-emoji.css" />
</svelte:head>

<nav class:isTop>
  <ul>
    {#each Config.navLinks as { href, title }}
      <li>
        <a sveltekit:prefetch {href} aria-current={href === $page.url.pathname ? 'page' : undefined}>
          {title}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<slot />

<footer class="global-footer">
  Built with <a href="https://github.com/kissge/monolog">monolog</a>
</footer>

<style lang="sass" global>
  @use '../assets/stylesheets/global'
</style>
