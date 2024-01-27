<script lang="ts">
  import { FormatUtility } from '$lib/utilities';

  export let date: string | Date | undefined;

  $: [d, t] = !date
    ? []
    : typeof date !== 'string' || /[0-9+-]+T[0-9:.]+[0-9:Z+-]+/.test(date)
      ? FormatUtility.datetime(date).split(' ')
      : [date];
</script>

{#if t}
  <time title={FormatUtility.relative(date)}>{d}<span>T</span>{t}<span>+09:00</span></time>
{:else}
  <time title={FormatUtility.relative(date)}>{d}</time>
{/if}

<style>
  time {
    white-space: nowrap;
  }

  span {
    opacity: 0.1;
    transition: opacity 0.1s ease-in-out;
  }

  :not(:hover) > span {
    opacity: 0.3;
  }
</style>
