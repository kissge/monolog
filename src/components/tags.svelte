<script lang="ts">
  import type { JSON, Tag } from '$lib/@types';

  export let tags: JSON<Tag>[];
  export let large = false;
</script>

{#each tags as { name, kind, urlPath }, i}
  <a sveltekit:prefetch href={urlPath} class="tag" class:large data-kind={kind}>{name}</a>
  {#if i >= 2}
    <wbr />
  {/if}
{/each}

<style lang="sass">
.tag
    display: inline-block
    margin-left: 0.3em
    padding: 0.1em 0.4em
    border-radius: 5px
    background-color: #eee
    text-decoration: none
    white-space: nowrap
    font-size: 0.7em
    line-height: 1.4

    &:hover
        background-color: #ddd

    &.large
        margin-right: 0.3em
        margin-left: 0
        font-size: 1em

    &::before
        color: #757575
</style>
