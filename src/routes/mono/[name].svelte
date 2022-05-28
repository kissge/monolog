<script lang="ts">
  import { page } from '$app/stores';
  import type { APIResponse } from './[name]';

  export let body: APIResponse['body'];
</script>

<h1>{$page.params.name}</h1>

{@html body}
