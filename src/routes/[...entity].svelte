<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';
  import { Links, Mentions, Time, defineXScriptCustomElement } from '../components';
  import type { APIResponse } from './[...entity]';

  export let entity: APIResponse['entity'];

  $: title =
    entity.name +
    (entity.attributes.date ? ' - ' + FormatUtility.date(entity.attributes.date) : '') +
    ' | ' +
    Config.siteTitle;

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

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={entity.headline} />
  <meta property="og:site_name" content={Config.siteTitle} />
  <meta
    property="og:image"
    content={entity.attributes.header
      ? /^\.{0,2}\//.test(entity.attributes.header)
        ? $page.url.origin + '/' + entity.attributes.header
        : entity.attributes.header
      : $page.url.origin + '/images/default.png'}
  />
</svelte:head>

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

    <Mentions />
  </article>
</main>

<style lang="sass">
  @use '../assets/viewer'
  :global .body
    @import '../assets/viewer-body'
</style>
