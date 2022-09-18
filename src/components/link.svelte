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
  <a sveltekit:prefetch href={entity.urlPath} class="monolog-link" data-kind={entity.kind} class:empty={entity.isEmpty}>
    {entity.name}
  </a>
{/if}

<style lang="sass">
  .monolog-link::before
    display: inline-block
    padding-right: 0.5em
    width: 1.75em
    vertical-align: baseline
    text-align: center
    font-size: 0.75em
</style>
