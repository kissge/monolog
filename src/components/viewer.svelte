<script lang="ts">
  import type { HTMLString } from '$lib/@types';

  import Time from './time.svelte';

  export let title: string;
  export let date: string | undefined;
  export let historyURL: string;
  export let tags: string[] | undefined;
  export let body: HTMLString;
</script>

<main>
  <article>
    <header>
      <h1>{title}</h1>

      <section class="meta">
        <p>
          <Time {date} />
        </p>
        <p>
          <a href={historyURL}>更新履歴</a>
        </p>
      </section>

      {#if tags}
        <section>
          {#each tags as tag}
            <div class="tag">#{tag}</div>
          {/each}
        </section>
      {/if}
    </header>

    <section class="body">
      {@html body}
    </section>
  </article>
</main>

<style lang="sass">
  @use '../assets/viewer'
  :global .body
    @import '../assets/viewer-body'
</style>
