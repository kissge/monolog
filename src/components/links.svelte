<script lang="ts">
  import type { JSON, LinkGroup } from '$lib/@types';

  export let links: JSON<LinkGroup<any>>[];
</script>

{#each links as { name, entities }}
  {#if entities.length > 0}
    <li class="link-group">
      <h1 class="link-group-title">{name}</h1>
      <ul class="link-group-links">
        {#each entities as entity}
          <li class="link">
            <a sveltekit:prefetch href={entity.urlPath}>
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
      </ul>
    </li>
  {/if}
{/each}
