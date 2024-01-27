<script lang="ts">
  export let data;
</script>

<ol>
  {#each data.allPaths as path}
    <li><a href={path}>{path}</a></li>
  {/each}
</ol>
