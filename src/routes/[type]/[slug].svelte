<script lang="ts">
  import type { APIResponse } from './[slug]';
  import Viewer from '../../components/viewer.svelte';

  export let entity: APIResponse['entity'];
</script>

<Viewer {entity} />
