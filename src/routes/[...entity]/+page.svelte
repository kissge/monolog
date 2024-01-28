<script lang="ts">
  import { onMount } from 'svelte';
  import IntersectionObserver from 'svelte-intersection-observer';
  import { page } from '$app/stores';
  import { Links, Mentions, Tags, Time, defineXScriptCustomElement } from '$lib/components';
  import GitHubIcon from '$lib/assets/images/brand-github.svg';
  import PresentationIcon from '$lib/assets/images/presentation.svg';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';
  import type { LinkCategory } from '$lib/@types';

  import '$lib/assets/stylesheets/viewer-body.scss';

  export let data;

  let headerElement: HTMLElement;
  let isHeaderInView = true;

  $: title =
    data.entity.name +
    (data.entity.attributes?.date ? ' - ' + FormatUtility.date(data.entity.attributes.date) : '') +
    ' | ' +
    Config.siteTitle;

  $: name = $page.url.pathname.startsWith('/mono/') ? data.entity.name : 'この記事';

  $: hasLink = Object.values(data.entity.links)
    .filter(Boolean)
    .some(({ entities }) => entities.length > 0);
  $: links = (
    [
      {
        id: 'is_a',
        name: name + 'であるもの',
      },
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
        name: data.entity.kind ? 'ほかの' + data.entity.kind : '',
      },
      ...Object.entries(data.entity.links)
        .filter((kv): kv is [LinkCategory, (typeof kv)[1]] => kv[0].startsWith('one_hop_'))
        .map(([id]) => ({
          id,
          name: id.replace(/^one_hop_/, '') + 'にリンクしているもの',
        })),
    ] satisfies { id: LinkCategory; name: string }[]
  )
    .filter(({ id }) => data.entity.links[id]?.entities?.length)
    .map(({ id, name }) => ({ name, ...data.entity.links[id]! }));

  $: noHeaderImage =
    data.entity.attributes?.header === false || (data.entity.kind !== 'note' && !data.entity.attributes?.header);

  $: url = ((url) => {
    if (!url) {
      return;
    }

    if (url.startsWith('https://github.com/')) {
      return { type: 'github', url, text: url.split('/').slice(3, 5).join('/') };
    }

    return { type: null, url, text: url.replace(/^https?:\/\/(?:www\.)?/, '') };
  })(data.entity.attributes?.url);

  onMount(() => {
    defineXScriptCustomElement();
  });

  async function startSlideshow() {
    (await import('$lib/components/slideshow')).default(data.entity.body);
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={data.entity.headline} />
  <meta
    property="og:image"
    content={data.entity.attributes?.header
      ? /^\.{0,2}\//.test(data.entity.attributes.header)
        ? 'https://' + Config.siteHostname + '/' + data.entity.attributes.header
        : data.entity.attributes.header
      : 'https://' + Config.siteHostname + '/images/og.png'}
  />
</svelte:head>

<div
  class="nav-background"
  class:isHeaderInView
  style={data.entity.attributes?.header ? `background-image: url(${data.entity.attributes.header})` : ''}
/>

<main>
  <article data-kind={data.entity.kind} class:empty={data.entity.isEmpty}>
    <header class="viewer-header" class:noHeaderImage>
      <h1>
        {#each data.entity.nameSegmented as segment, i}{#if i > 0}<wbr />{/if}{segment}{/each}
      </h1>

      {#if data.entity.attributes?.definition}
        <h2>{data.entity.attributes.definition}</h2>
      {/if}

      <section class="meta">
        {#if data.entity.attributes?.date}
          <p>
            <Time date={data.entity.attributes.date} />
          </p>
        {/if}

        {#if data.entity.historyURL}
          <p>
            <a href={data.entity.historyURL} title={data.entity.lastModified?.toLocaleString('ja')}>
              最終更新：{FormatUtility.relative(data.entity.lastModified)}
            </a>
          </p>
        {/if}
      </section>

      {#if url}
        <section class="url">
          {#if url.type === 'github'}
            <a href={url.url} rel="external">
              <img src={GitHubIcon} alt="GitHub" class="link-icon" width="16" height="13" />{url.text}
            </a>
          {:else}
            <a href={url.url} rel="external">{url.text}</a>
          {/if}
        </section>
      {/if}

      {#if data.entity.tags.length > 0}
        <section>
          <Tags tags={data.entity.tags} large />
        </section>
      {/if}

      {#if data.entity.attributes?.slides}
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
          style={data.entity.attributes?.header ? `background-image: url(${data.entity.attributes.header})` : ''}
          bind:this={headerElement}
        />
      </IntersectionObserver>
    </header>

    <section class="body" lang={data.entity.attributes?.lang}>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.entity.body}
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

<style lang="scss">
  @import '$lib/assets/stylesheets/viewer';
</style>
