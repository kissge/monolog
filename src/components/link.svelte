<script lang="ts">
  import ExternalLinkIcon from '../assets/images/external-link.svg';
  import type { Entity, JSON } from '$lib/@types';

  export let entity: JSON<Entity>;
</script>

{#if entity.attributes?.external}
  <a href={entity.urlPath} rel="external">
    <img src={ExternalLinkIcon} alt="外部リンク" class="link-icon" width="16" height="16" />{entity.name}
  </a>
{:else}
  <a sveltekit:prefetch href={entity.urlPath}>
    {entity.name}
  </a>
{/if}
