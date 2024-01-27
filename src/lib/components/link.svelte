<script lang="ts">
  import ExternalLinkIcon from '$lib/assets/images/external-link.svg';
  import type { Entity } from '$lib/@types';

  export let entity: Entity;
</script>

{#if entity.attributes?.external}
  <a href={entity.urlPath} rel="external">
    <img src={ExternalLinkIcon} alt="外部リンク" class="link-icon" width="16" height="16" />{entity.name}
  </a>
{:else}
  <a href={entity.urlPath} class="monolog-link" data-kind={entity.kind} class:empty={entity.isEmpty}>
    {entity.name}
  </a>
{/if}

<style>
  .monolog-link::before {
    display: inline-block;
    width: 1.75em;
    padding-right: 0.5em;
    font-size: 0.75em;
    text-align: center;
    vertical-align: baseline;
  }
</style>
