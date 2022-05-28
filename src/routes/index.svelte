<script lang="ts">
  import { FormatUtility } from '$lib/utilities';
  import type { APIResponse } from '.';

  export let notes: APIResponse['notes'];
  export let groups: APIResponse['groups'];
</script>

<input type="checkbox" id="notes-expanded" />

<main>
  <ol class="groups">
    <li class="group">
      <h1 class="group-title">書いたもの</h1>
      <ol class="notes">
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
            <a sveltekit:prefetch href="notes/{note.slug}">
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

    {#each groups as group}
      <li class="group">
        <h1 class="group-title">{group.name}</h1>
        <ol class="entities">
          {#each group.entities as entity}
            <li class="entity">
              <a sveltekit:prefetch href="mono/{entity.name}">
                {entity.name}
              </a>
              <p>
                {entity.attributes.definition ?? ''}
                {#each entity.attributes.tags || [] as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </p>
            </li>
          {/each}
        </ol>
      </li>
    {/each}
  </ol>
</main>

<style lang="sass">
  @use '../assets/top'
</style>
