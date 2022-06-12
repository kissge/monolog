<script lang="ts">
  import type { APIResponse } from './all';

  export let all: APIResponse['all'];
</script>

<ol>
  {#each all as path}
    <li><a href={path}>{path}</a></li>
  {/each}
</ol>
