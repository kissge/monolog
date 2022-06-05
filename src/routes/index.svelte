<script lang="ts">
  import { page } from '$app/stores';
  import Links from '../components/links.svelte';
  import type { APIResponse } from '.';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';

  export let notes: APIResponse['notes'];
  export let groups: APIResponse['groups'];
</script>

<svelte:head>
  <title>{Config.siteTitle}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={Config.siteTitle} />
  <meta property="og:site_name" content={Config.siteTitle} />
  <meta property="og:image" content="{$page.url.origin}/images/favicon.svg" />
</svelte:head>

<input type="checkbox" id="notes-expanded" />

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
            <a sveltekit:prefetch href={note.urlPath}>
              {note.attributes.title}
            </a>
            {#each note.tags as tag}
              <a sveltekit:prefetch href={tag.urlPath} class="tag">#{tag.name}</a>
            {/each}
          </li>
        {/each}
        <li>
          <label for="notes-expanded" />
        </li>
      </ol>
    </li>

    <Links links={groups} />
  </ol>
</main>

<style lang="sass">
  @use '../assets/top'
</style>
