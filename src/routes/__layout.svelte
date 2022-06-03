<script lang="ts">
  import { page } from '$app/stores';
  import Config from '$lib/config';

  $: isTop = $page.url.pathname === '/';
</script>

<nav class:isTop>
  <ul>
    {#each Config.navLinks as { href, title }}
      <li>
        <a sveltekit:prefetch {href} aria-current={href === $page.url.pathname && !isTop ? 'page' : undefined}>
          {title}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<slot />

<footer>
  Built with <a href="https://github.com/kissge/monolog">monolog</a>
</footer>

<style lang="sass" global>
  @use '../assets/global'
</style>
