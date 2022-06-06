<script lang="ts">
  import type { Entity, JSON, LinkGroup } from '$lib/@types';
  import { FormatUtility } from '$lib/utilities';

  export let links: JSON<LinkGroup<Entity>>[];
</script>

{#each links as { name, urlPath, entities }}
  {#if entities.length > 0}
    <li class="link-group">
      <h1 class="link-group-title">{name}</h1>
      <ul class="link-group-links">
        {#each entities as entity}
          <li class="link">
            <a sveltekit:prefetch href={entity.urlPath}>
              {entity.attributes?.title || entity.name}
            </a>
            {#if entity.attributes?.date}
              <small title={entity.attributes.date}>
                <time>
                  {FormatUtility.date(entity.attributes.date)}
                </time>
              </small>
            {/if}
            <span class="tags">
              {#each entity.tags.filter((tag) => tag.name !== name && tag.urlPath !== urlPath) as tag, i}
                <a sveltekit:prefetch href={tag.urlPath} class="tag">#{tag.name}</a>
                {#if i >= 2}
                  <wbr />
                {/if}
              {/each}
            </span>
            <p>
              {entity.attributes?.definition ?? ''}
            </p>
          </li>
        {/each}
      </ul>
    </li>
  {/if}
{/each}
