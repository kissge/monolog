<script lang="ts">
  import type { APIResponse } from '.';

  export let notes: APIResponse['notes'];
  export let groups: APIResponse['groups'];
</script>

<section>
  <ol>
    {#each notes as note}
      <li>
        <a sveltekit:prefetch href="notes/{note.slug}">
          {note.attributes.date}
          {note.attributes.title}
        </a>
      </li>
    {/each}
  </ol>
</section>

<section>
  <ol>
    {#each groups as group}
      <li>
        {group.name}
        <ol>
          {#each group.entities as entity}
            <li>
              <a sveltekit:prefetch href="mono/{entity.name}">
                {entity.name}
              </a>
            </li>
          {/each}
        </ol>
      </li>
    {/each}
  </ol>
</section>
