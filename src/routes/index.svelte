<script lang="ts">
  import { page } from '$app/stores';
  import ExternalLinkIcon from '../assets/images/external-link.svg';
  import { Links, Tags } from '../components';
  import type { APIResponse } from '.';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';

  export let notes: APIResponse['notes'];
  export let groups: APIResponse['groups'];
  export let tags: APIResponse['tags'];
</script>

<svelte:head>
  <title>{Config.siteTitle}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={Config.siteTitle} />
  <meta property="og:site_name" content={Config.siteTitle} />
  <meta property="og:image" content="{$page.url.origin}/images/favicon.svg" />
</svelte:head>

<input type="checkbox" id="notes-expanded" aria-label="もっと見る" />

<main>
  <ol class="links">
    <li class="link-group">
      <h1 class="link-group-title">書いたもの</h1>
      <ol class="link-group-links notes">
        {#each notes as note}
          <li class="note">
            <small title={note.attributes.date}>
              <time>
                {FormatUtility.date(note.attributes.date)}
              </time>
              <span class="relative">
                （{FormatUtility.relative(note.attributes.date)}）
              </span>
            </small>
            {#if note.attributes.from}
              <span title="インポートされた記事">⚠️</span>
            {/if}
            {#if note.attributes.external}
              <a href={note.urlPath} rel="external">
                <img src={ExternalLinkIcon} alt="外部リンク" class="link-icon" width="16" height="16" />{note.name}
              </a>
            {:else}
              <a sveltekit:prefetch href={note.urlPath}>
                {note.name}
              </a>
            {/if}
            <Tags tags={note.tags} />
          </li>
        {/each}
        <li>
          <label for="notes-expanded" />
        </li>
      </ol>
    </li>

    <Links links={groups} />

    <li class="link-group">
      <h1 class="link-group-title">すべてのtag</h1>
      <ul class="link-group-links">
        {#each tags as entity}
          <li class="link">
            <a sveltekit:prefetch href={entity.urlPath}>{entity.name}</a>
          </li>
        {/each}
      </ul>
    </li>
  </ol>
</main>

<style lang="sass">
  @use '../assets/stylesheets/top'
</style>
