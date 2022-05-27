<script lang="ts">
  import type { APIResponse } from '.';

  export let notes: APIResponse['notes'];
</script>

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
