<script lang="ts">
  import { Link, Links, Tags } from '$lib/components';
  import * as Config from '$lib/config';
  import { FormatUtility } from '$lib/utilities';

  export let data;
</script>

<svelte:head>
  <title>{Config.siteTitle}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content={Config.siteTitle} />
  <meta property="og:image" content="https://{Config.siteHostname}/images/og.png" />
</svelte:head>

<input type="checkbox" id="notes-expanded" aria-label="もっと見る" />

<main>
  <ol class="links">
    <li class="link-group">
      <h1 class="link-group-title">書いたもの</h1>
      <ol class="link-group-links notes">
        {#each data.notes as note}
          <li class="note">
            <small title={note.attributes.date.toLocaleString()}>
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
            <Link entity={note} />
            <Tags tags={note.tags} />
          </li>
        {/each}
        <li>
          <label for="notes-expanded" />
        </li>
      </ol>
    </li>

    <Links links={data.groups} />

    <li class="link-group">
      <h1 class="link-group-title">すべてのtag</h1>
      <ul class="link-group-links">
        {#each data.tags as entity}
          <li class="link">
            <Link {entity} />
          </li>
        {/each}
      </ul>
    </li>
  </ol>
</main>

<style lang="scss">
  @import '$lib/assets/stylesheets/top';
</style>
