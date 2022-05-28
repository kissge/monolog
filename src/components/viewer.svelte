<script lang="ts">
  import type { HTMLString } from '$lib/@types';

  import Time from './time.svelte';

  export let title: string;
  export let headline: string | undefined = undefined;
  export let date: string | undefined;
  export let historyURL: string;
  export let tags: string[] | undefined;
  export let body: HTMLString;
</script>

<main>
  <article>
    <header>
      <h1>{title}</h1>

      {#if headline}
        <h2>{headline}</h2>
      {/if}

      <section class="meta">
        {#if date}
          <p>
            <Time {date} />
          </p>
        {/if}

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
