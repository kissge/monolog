<script lang="ts">
  import type { Tag } from '$lib/@types';

  export let tags: Tag[];
  export let large = false;
</script>

{#each tags as { name, kind, urlPath }, i}
  <a href={urlPath} class="tag" class:large data-kind={kind}>{name}</a>
  {#if i >= 2}
    <wbr />
  {/if}
{/each}

<style>
  .tag {
    display: inline-block;
    padding: 0.1em 0.4em;
    margin-left: 0.3em;
    font-size: 0.7em;
    line-height: 1.4;
    text-decoration: none;
    white-space: nowrap;
    background-color: #eee;
    border-radius: 5px;
    opacity: 0.65;
    transition: opacity 0.5s ease-in-out;

    &:hover {
      background-color: #ddd;
    }

    &.large {
      margin-right: 0.3em;
      margin-left: 0;
      font-size: 1em;
      opacity: 1;
    }

    &::before {
      color: #757575;
    }
  }

  :has(li:hover > .tag),
  :has(li:hover > span > .tag) {
    opacity: 1;
  }
</style>
