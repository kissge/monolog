<script lang="ts">
  import { FormatUtility } from '$lib/utilities';

  export let date: string | undefined;

  $: [d, t] = date && /[0-9+-]+T[0-9:.]+[0-9:Z+-]+/.test(date) ? FormatUtility.datetime(date).split(' ') : [date];
</script>

{#if t}
  <time title={FormatUtility.relative(date)}>{d}<span>T</span>{t}<span>+09:00</span></time>
{:else}
  <time title={FormatUtility.relative(date)}>{d}</time>
{/if}

<style lang="sass">
time
  white-space: nowrap

span
  opacity: 0.1
  transition: opacity 0.1s ease-in-out

  :not(:hover) > &
    opacity: 0.3
</style>
