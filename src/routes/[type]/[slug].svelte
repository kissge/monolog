<script lang="ts">
  import type { APIResponse } from './[slug]';

  export let attributes: APIResponse['attributes'];
  export let body: APIResponse['body'];
</script>

<h1>{attributes.title}</h1>

{@html body}
