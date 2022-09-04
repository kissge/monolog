<script context="module" lang="ts">
  // eslint-disable-next-line import/order
  import type { Load } from './__types/[...entity]';

  export const load: Load = ({ props }) => {
    if (props.entity.attributes?.header && typeof document !== 'undefined') {
      new Image().src = props.entity.attributes.header;
    }

    return { props };
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import IntersectionObserver from 'svelte-intersection-observer';
  import { page } from '$app/stores';
  import { Links, Mentions, Tags, Time, defineXScriptCustomElement } from '../components';
  import GitHubIcon from '../assets/images/brand-github.svg';
  import PresentationIcon from '../assets/images/presentation.svg';
  import type { APIResponse } from './[...entity]';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';
  import type { LinkCategory } from '$lib/@types';

  export let entity: APIResponse['entity'];

  let headerElement: HTMLElement;
  let isHeaderInView = true;

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

  $: url = ((url) => {
    if (!url) {
      return;
    }

    if (url.startsWith('https://github.com/')) {
      return { type: 'github', url, text: url.split('/').slice(3, 5).join('/') };
    }

    return { type: null, url, text: url.replace(/^https?:\/\/(?:www\.)?/, '') };
  })(entity.attributes?.url);

  onMount(() => {
    defineXScriptCustomElement();
  });

  async function startSlideshow() {
    (await import('../components/slideshow')).default(entity.body);
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={entity.headline} />
  <meta
    property="og:image"
    content={entity.attributes?.header
      ? /^\.{0,2}\//.test(entity.attributes.header)
        ? 'https://' + Config.siteHostname + '/' + entity.attributes.header
        : entity.attributes.header
      : 'https://' + Config.siteHostname + '/images/favicon.svg'}
  />
</svelte:head>

<div
  class="nav-background"
  class:isHeaderInView
  style={entity.attributes?.header ? `background-image: url(${entity.attributes.header})` : ''}
/>

<main>
  <article data-kind={entity.kind}>
    <header class:noHeaderImage>
      <h1>
        {#each entity.nameSegmented as segment, i}{#if i > 0}<wbr />{/if}{segment}{/each}
      </h1>

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
            <a href={entity.historyURL} title={entity.lastModified}>
              最終更新：{FormatUtility.relative(entity.lastModified)}
            </a>
          </p>
        {/if}
      </section>

      {#if url}
        <section class="url">
          {#if url.type === 'github'}
            <a href={url.url}>
              <img src={GitHubIcon} alt="GitHub" rel="external" class="link-icon" width="16" height="13" />{url.text}
            </a>
          {:else}
            <a href={url.url} rel="external">{url.text}</a>
          {/if}
        </section>
      {/if}

      {#if entity.tags.length > 0}
        <section>
          <Tags tags={entity.tags} large />
        </section>
      {/if}

      {#if entity.attributes?.slides}
        <section class="toolbar">
          <button on:click={startSlideshow}>
            <img src={PresentationIcon} alt="Presentation" class="link-icon" width="24" height="19.5" />
            プレゼンテーション表示に切り替える
          </button>
        </section>
      {/if}

      <IntersectionObserver element={headerElement} bind:intersecting={isHeaderInView} rootMargin="-64px">
        <section
          class="header-image"
          class:noHeaderImage
          style={entity.attributes?.header ? `background-image: url(${entity.attributes.header})` : ''}
          bind:this={headerElement}
        />
      </IntersectionObserver>
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
  @use '../assets/stylesheets/viewer'
  :global .body
    @import '../assets/stylesheets/viewer-body'
</style>
