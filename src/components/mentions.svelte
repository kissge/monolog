<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/env';
  import Time from './time.svelte';
  import type { JF2MentionItem } from '$lib/@types';

  let mentions: JF2MentionItem[] | undefined;

  const verb = {
    'in-reply-to': 'mentioned',
    'like-of': 'liked',
    'repost-of': 'retweeted',
    'bookmark-of': 'liked',
    'mention-of': 'mentioned',
    rsvp: 'mentioned',
  };

  onMount(async () => {
    if (!dev) {
      mentions = undefined;

      const response = await fetch(
        'https://webmention.io/api/mentions.jf2?target=' +
          encodeURIComponent(location.href.replace(/[#?].*/, '').replace(/\/+$/, '') + '/'),
      );
      const jf2 = await response.json();

      (jf2.children as JF2MentionItem[]).sort((a, b) =>
        (b.published || b['wm-received']).localeCompare(a.published || a['wm-received']),
      );

      mentions = jf2.children;
    }
  });
</script>

<section class="mentions">
  <h1>Recent public mentions on Twitter</h1>
  <ol reversed>
    {#if mentions}
      {#each mentions as mention}
        <li>
          <Time date={mention.published || mention['wm-received']} />
          <a href={mention.author.url}>
            <img src={mention.author.photo} alt={mention.author.name} />{mention.author.name}
            {#if /^https:\/\/twitter.com\/[^/]+\/?$/.test(mention.author.url)}
              (@{mention.author.url.split('/')[3]})
            {/if}
          </a>
          <a href={mention.url}>{verb[mention['wm-property']]}</a>.
          {#if mention.content?.text}
            <blockquote>
              {mention.content.text}
            </blockquote>
          {/if}
        </li>
      {:else}
        Twitterで言及していただけると自動的にここに収集されます。
      {/each}
    {:else}
      Loading mentions...
    {/if}
  </ol>
</section>

<style lang="sass">
  @use '../assets/mentions'
</style>
