<script lang="ts">
  import { page } from '$app/stores';
  import * as Config from '$lib/config';

  import '$lib/assets/stylesheets/global.scss';

  $: isTop = $page.route.id !== '/[...entity]';
</script>

<nav class:isTop>
  <ul>
    {#each Config.navLinks as { href, title }}
      <li>
        <a {href} aria-current={href === $page.url.pathname ? 'page' : undefined}>
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
