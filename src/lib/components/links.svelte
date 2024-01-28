<script lang="ts">
  import { Link, Tags } from '.';
  import type { LinkGroup } from '$lib/@types';
  import { FormatUtility } from '$lib/utilities';

  export let links: LinkGroup[];
</script>

{#each links as { name, urlPath, entities }}
  {#if entities.length}
    <li class="link-group">
      <h1 class="link-group-title">{name}</h1>
      <ul class="link-group-links">
        {#each entities as entity}
          <li class="link">
            <Link {entity} />
            {#if entity.attributes?.date}
              <small title={entity.attributes.date.toLocaleString('ja')}>
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
