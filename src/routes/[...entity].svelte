<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { Links, Mentions, Tags, Time, defineXScriptCustomElement } from '../components';
  import type { APIResponse } from './[...entity]';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';
  import type { LinkCategory } from '$lib/@types';

  export let entity: APIResponse['entity'];

  $: title =
    entity.name +
    (entity.attributes?.date ? ' - ' + FormatUtility.date(entity.attributes.date) : '') +
    ' | ' +
    Config.siteTitle;

  $: name = $page.url.pathname.startsWith('/mono/') ? entity.name : 'この記事';

  $: hasLink = Object.values(entity.links).some(({ entities }) => entities.length > 0);
  $: links = (
    [
      {
        id: 'to',
        name: name + 'がリンクしているもの',
      },
      {
        id: 'from',
        name: name + 'にリンクしているもの',
      },
      {
        id: 'kind',
        name: entity.kind ? 'ほかの' + entity.kind : '',
      },
      ...Object.entries(entity.links)
        .filter(([id]) => id.startsWith('one_hop_'))
        .map(([id]) => ({
          id,
          name: id.replace(/^one_hop_/, '') + 'にリンクしているもの',
        })),
    ] as { id: LinkCategory; name: string }[]
  ).map(({ id, name }) => ({ name, ...entity.links[id] }));

  $: noHeaderImage = entity.attributes?.header === false || (entity.kind !== 'note' && !entity.attributes?.header);

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
    content={entity.attributes?.header
      ? /^\.{0,2}\//.test(entity.attributes.header)
        ? $page.url.origin + '/' + entity.attributes.header
        : entity.attributes.header
      : $page.url.origin + '/images/favicon.svg'}
  />
</svelte:head>

<main>
  <article data-kind={entity.kind}>
    <header class:noHeaderImage>
      <h1>{entity.name}</h1>

      {#if entity.attributes?.definition}
        <h2>{entity.attributes.definition}</h2>
      {/if}

      <section class="meta">
        {#if entity.attributes?.date}
          <p>
            <Time date={entity.attributes.date} />
          </p>
        {/if}

        {#if entity.historyURL}
          <p>
            <a href={entity.historyURL}>更新履歴</a>
          </p>
        {/if}
      </section>

      {#if entity.tags.length > 0}
        <section>
          <Tags tags={entity.tags} large />
        </section>
      {/if}

      <section
        class="header-image"
        class:noHeaderImage
        style={entity.attributes?.header ? `background-image: url(${entity.attributes.header})` : ''}
      />
    </header>

    <section class="body" lang={entity.attributes?.lang}>
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
