<script lang="ts">
  import type { APIResponse } from './[...note]';
  import Viewer from '../components/viewer.svelte';

  export let entity: APIResponse['entity'];
</script>

<Viewer {entity} />
