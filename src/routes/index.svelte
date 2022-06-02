<script lang="ts">
  import { FormatUtility } from '$lib/utilities';
  import type { APIResponse } from '.';
  import Links from '../components/links.svelte';

  export let notes: APIResponse['notes'];
  export let groups: APIResponse['groups'];
</script>

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
            {#each note.attributes.tags || [] as tag}
              <span class="tag">#{tag}</span>
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
