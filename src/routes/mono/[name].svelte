<script lang="ts">
  import type { APIResponse } from './[name]';
  import Viewer from '../../components/viewer.svelte';

  export let attributes: APIResponse['attributes'];
  export let links: APIResponse['links'];
  export let body: APIResponse['body'];
  export let name: APIResponse['name'];
  export let historyURL: APIResponse['historyURL'];
</script>

<Viewer
  title={name}
  headline={attributes.definition}
  date={attributes.date}
  {historyURL}
  tags={attributes.tags}
  {body}
  {links}
  isMono
/>
