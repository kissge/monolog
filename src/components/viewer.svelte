<script lang="ts">
  import type { EntityWithBody, JSON } from '$lib/@types';
  import Links from './links.svelte';
  import Time from './time.svelte';

  export let headline: string | undefined = undefined;
  export let entity: JSON<EntityWithBody<any>>;
  export let isMono: boolean = false;

  $: hasLink = Object.values(entity.links).some((entities) => entities.length > 0);
  $: links = [
    {
      id: 'to' as const,
      name: (isMono ? entity.name : 'この記事') + 'がリンクしているもの',
    },
    {
      id: 'from' as const,
      name: (isMono ? entity.name : 'この記事') + 'にリンクしているもの',
    },
    {
      id: 'kind' as const,
      name: entity.kind ? 'ほかの' + entity.kind : '',
    },
  ].map(({ id, name }) => ({ name, entities: entity.links[id] }));
</script>

<main>
  <article>
    <header>
      <h1>{entity.name}</h1>

      {#if headline}
        <h2>{headline}</h2>
      {/if}

      <section class="meta">
        {#if entity.attributes.date}
          <p>
            <Time date={entity.attributes.date} />
          </p>
        {/if}

        <p>
          <a href={entity.historyURL}>更新履歴</a>
        </p>
      </section>

      {#if entity.attributes.tags}
        <section>
          {#each entity.attributes.tags as tag}
            <div class="tag">#{tag}</div>
          {/each}
        </section>
      {/if}
    </header>

    <section class="body">
      {@html entity.body}
    </section>

    {#if hasLink}
      <section class="links-section">
        <ul class="links">
          <Links {links} />
        </ul>
      </section>
    {/if}
  </article>
</main>

<style lang="sass">
  @use '../assets/viewer'
  :global .body
    @import '../assets/viewer-body'
</style>
