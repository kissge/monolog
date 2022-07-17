<script lang="ts">
  import ExternalLinkIcon from '../assets/images/external-link.svg';
  import { Tags } from '.';
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
            {#if entity.attributes?.external}
              <a href={entity.urlPath} rel="external">
                <img src={ExternalLinkIcon} alt="外部リンク" class="link-icon" width="16" height="16" />{entity.name}
              </a>
            {:else}
              <a sveltekit:prefetch href={entity.urlPath}>
                {entity.name}
              </a>
            {/if}
            {#if entity.attributes?.date}
              <small title={entity.attributes.date}>
                <time>
                  {FormatUtility.date(entity.attributes.date)}
                </time>
              </small>
            {/if}
            <span class="tags">
              <Tags tags={entity.tags.filter((tag) => tag.name !== name && tag.urlPath !== urlPath)} />
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
