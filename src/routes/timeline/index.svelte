<script lang="ts">
  import { Links } from '../../components';
  import type { APIResponse } from '.';
  import * as Config from '$lib/config';

  export let timeline: APIResponse['timeline'];
</script>

<svelte:head>
  <title>タイムライン | {Config.siteTitle}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="タイムライン | {Config.siteTitle}" />
  <meta property="og:image" content="https://{Config.siteHostname}/images/og.png" />
</svelte:head>

<main>
  <ol reversed class="links">
    <Links links={timeline.map(({ age, entities }) => ({ name: `${age}歳`, urlPath: '', entities }))} />
  </ol>
</main>
