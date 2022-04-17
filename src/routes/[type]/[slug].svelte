<script context="module" lang="ts">
  import type SapperCommon from '@sapper/common';

  export async function preload(
    this: SapperCommon.PreloadContext,
    { params }: { params: { type: string; slug: string } },
  ) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${params.type}/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {
        post: data,
        historyURL: `https://github.com/${config.dataGitHubRepo}/commits/master/${params.type}/${params.slug}.md`,
      };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import { config } from '../../config';
  import { onMount } from 'svelte';
  import { toJSTISOString } from '../../utility';
  import { defineCustomElement } from '../../components/x-script';

  export let post: Post;
  export let historyURL: string;
  export let mentions: JF2;

  onMount(() => {
    fetch(
      'https://webmention.io/api/mentions.jf2?target=' +
        encodeURIComponent(config.host + location.pathname + (location.pathname.match(/\/$/) ? '' : '/')),
    ).then((res) =>
      res.json().then((jf2) => {
        mentions = jf2;
        mentions.children.sort((a, b) =>
          (b.published || b['wm-received']).localeCompare(a.published || a['wm-received']),
        );
      }),
    );
    defineCustomElement();
  });
</script>

<svelte:head>
  <title>{post.title} - {new Date(post.date).toISOString().slice(0, 10)} | {config.title}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:title"
    content="{post.title} - {new Date(post.date).toISOString().slice(0, 10)} | {config.title}"
  />
  <meta property="og:description" content={post.headline} />
  <meta property="og:site_name" content={config.title} />
  <meta
    property="og:image"
    content={post.header
      ? /^\.{0,2}\//.test(post.header)
        ? config.host + '/' + post.header
        : post.header
      : config.host + '/images/default.png'}
  />
</svelte:head>

<header>
  <div class="img-header" style={post.header ? `background-image: url(${post.header})` : ''} />
  <h1>{post.title}</h1>
  {#if post.date}
    <time>{@html toJSTISOString(post.date)}</time>
  {/if}

  <div class="tags">
    {#each post.tags || [] as tag}
      <div class="tag">#{tag}</div>
    {/each}
  </div>

  <p class="history">
    <a href={historyURL}>更新履歴</a>
  </p>
</header>

{#if post.from}
  <div class="callout">
    この記事は以前別のところにあったものを移してきたものです。完璧に移植できておらず、表示が崩れているかもしれません。
  </div>
{/if}

<div class="content">
  {@html post.html}
</div>

{#if config.googleAdSenseClientID}
  <x-script
    data-ad-client={config.googleAdSenseClientID}
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  />
{/if}

<section class="mentions">
  <h1>Recent public mentions on Twitter</h1>
  <ol>
    {#if mentions}
      {#each mentions.children as mention}
        <li>
          <a href={mention.url}>{mention['wm-property']}</a>
          <a href={mention.author.url}>
            <img src={mention.author.photo} alt={mention.author.name} />{mention.author.name}
          </a>
          at {@html toJSTISOString(mention.published || mention['wm-received'])}
          {#if mention['wm-property'] === 'mention-of'}
            <blockquote>
              {mention.content.text}
            </blockquote>
          {/if}
        </li>
      {:else}
        Twitterで言及していただけると自動的にここに収集されます。
      {/each}
    {:else}
      Loading mentions...
    {/if}
  </ol>
</section>

<style type="text/sass">
  header
    padding-top: 360px

    .img-header
      position: absolute
      background: linear-gradient(132deg, rgba(0,212,255,1) 0%, rgba(9,88,121,1) 35%, rgba(2,0,36,1) 100%)
      background-size: cover
      top: 0
      left: 0
      width: 100vw
      height: 400px
      z-index: -1

    h1
      text-shadow: 0 1px 5px #fff

    time
      display: block
      text-align: right

    .tags
      .tag
        display: inline-block
        background: #d9d7d8
        padding: 4px 8px
        margin-right: 4px

    .history
      text-align: right
      font-size: 0.8em

  .callout
    margin: 4em 0
    padding: 1em
    background: #f0f091
    color: #000

    &::before
      float: left
      margin-right: 0.5em
      margin-left: 0.25em
      content: '⚠️'
      font-size: 2em

  .content
    :global(p)
      text-align: justify
      text-indent: 1em

    :global(h1)
      margin-top: 2em

    :global(h2)
      font-weight: 500
      font-size: 1.4em
      margin-top: 2em

    :global(h3)
      margin-top: 2em

    :global(pre)
      overflow-x: auto
      padding: 1em
      border-radius: 2px
      background-color: #f9f9f9
      box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05)

    :global(pre) :global(code)
      padding: 0
      background-color: transparent

    :global(ul)
      line-height: 1.5

    :global(li)
      margin: 0 0 0.5em 0

    :global(hr)
      margin: 5em auto
      width: calc(100% - 3em)
      border-style: dashed
      border-color: #ddd

    :global(img), :global(iframe)
      display: block
      margin: 3em auto
      max-width: 100%

    :global(blockquote)
      padding-left: 1.2em
      border-left: 5px solid #8fb6f0

    :global(p) + :global(blockquote)
      margin-top: 3em

    :global(a)
      color: #296fd8

    :global(strong)
      background: linear-gradient(transparent 60%, #efa 60%)

  .mentions
    margin-top: 3em
    padding: 2em
    #border-top: 1px solid #ccc
    background-color: #f7f7f7

    h1
      font-size: 1.2em

    img
      width: 1em
      height: 1em
      margin: 0 0.5em

    blockquote
      font-style: italic
      border-left: 3px solid #dfecda
      padding-left: 1em
</style>
