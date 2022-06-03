<script lang="ts">
  import type { APIResponse } from './[name]';
  import Viewer from '../../components/viewer.svelte';

  export let entity: APIResponse['entity'];
</script>

<Viewer headline={entity.attributes.definition} {entity} isMono />
