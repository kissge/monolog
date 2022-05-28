<script lang="ts">
  import { FormatUtility } from '$lib/utilities';

  export let date: string | undefined;

  let [d, t] = FormatUtility.datetime(date).split(' ');
</script>

<time title={FormatUtility.relative(date)}>{d}<span class="weak">T</span>{t}<span class="weak">+09:00</span></time>

<style lang="sass">
.weak
  opacity: 0.1
  transition: opacity 0.1s ease-in-out

  :not(:hover) > &
    opacity: 0.3
</style>
