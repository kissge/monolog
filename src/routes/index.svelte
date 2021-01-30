<script context="module" lang="ts">
  export function preload() {
    return this.fetch(`posts.json`)
      .then((r: { json: () => any }) => r.json())
      .then((posts: Post[]) => {
        return { posts };
      });
  }
</script>

<script lang="ts">
  import { config } from '../config';

  export let posts: Post[];
</script>

<svelte:head>
  <title>{config.title}</title>
</svelte:head>

<ul>
  {#each posts as post}
    <li class:old={post.from}>
      <small>{(post.date || '????-??-??').slice(0, 10)}</small>
      {#if post.from}
        ⚠️
      {/if}
      <a rel="prefetch" href="{post.type}/{post.slug}">{post.title}</a>
      {#each post.tags || [] as tag}<span class="tag">#{tag}</span>{/each}
    </li>
  {/each}
</ul>

<style type="text/sass">
  ul
    display: table

    margin-block: 0
    padding-inline: 0

  li
    display: table-row

    small
      display: table-cell
      width: 7em
      color: #555

  .old
    color: #777
    filter: blur(2px)
    transition: filter 0.5s linear

    &:hover
      filter: blur(0px)

    .tag
      border: 1px solid #d9d7d8
      background: unset

  .tag
    margin: 0 0.5em
    padding: 2px 8px
    background: #d9d7d8
</style>
