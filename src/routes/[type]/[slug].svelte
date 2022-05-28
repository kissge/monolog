<script lang="ts">
  import type { APIResponse } from './[slug]';
  import Viewer from '../../components/viewer.svelte';

  export let attributes: APIResponse['attributes'];
  export let body: APIResponse['body'];
  export let historyURL: APIResponse['historyURL'];
</script>

<Viewer title={attributes.title} date={attributes.date} {historyURL} tags={attributes.tags} {body} />
