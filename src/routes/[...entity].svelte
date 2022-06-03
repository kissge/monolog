<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { Links, Time, defineXScriptCustomElement } from '../components';
  import type { APIResponse } from './[...entity]';

  export let entity: APIResponse['entity'];

  $: isMono = $page.url.pathname.startsWith('/mono/');

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

  $: noHeaderImage = entity.attributes.header === false || (isMono && !entity.attributes.header);

  onMount(() => {
    defineXScriptCustomElement();
  });
</script>

<main>
  <article>
    <header class:noHeaderImage>
      <h1>{entity.name}</h1>

      {#if entity.attributes.definition}
        <h2>{entity.attributes.definition}</h2>
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

      <section
        class="header-image"
        class:noHeaderImage
        style={entity.attributes.header ? `background-image: url(${entity.attributes.header})` : ''}
      />
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
