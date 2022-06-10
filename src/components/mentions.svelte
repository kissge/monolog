<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { dev } from '$app/env';
  import likeIcon from '../assets/heart.svg';
  import mentionIcon from '../assets/message-circle.svg';
  import retweetIcon from '../assets/arrows-double-sw-ne.svg';
  import * as Config from '$lib/config';
  import type { JF2MentionItem } from '$lib/@types';
  import { FormatUtility } from '$lib/utilities';

  let mentions: JF2MentionItem[] | undefined;
  let url = '';

  const verb = {
    'in-reply-to': 'mentioned',
    'like-of': 'liked',
    'repost-of': 'retweeted',
    'bookmark-of': 'liked',
    'mention-of': 'mentioned',
    rsvp: 'mentioned',
  } as const;

  const icon = { liked: likeIcon, retweeted: retweetIcon, mentioned: mentionIcon };

  $: authorTweetID = mentions
    ?.find(
      (mention) =>
        mention['wm-property'] === 'like-of' &&
        mention.url.startsWith(`https://twitter.com/${Config.twitterID}/status/`),
    )
    ?.url.match(/(?<=status\/)\d+/)?.[0];

  afterNavigate(async () => {
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

    url = encodeURIComponent(location.href);
  });
</script>

<section class="mentions">
  <section class="reaction">
    {#if authorTweetID}
      <a
        href="https://twitter.com/intent/like?tweet_id={authorTweetID}"
        style:background-image="url({likeIcon})"
        style:color="#b80b4d"
      >
        <small>Twitterで</small>
        <span>いいねする</span>
      </a>
      <a
        href="https://twitter.com/intent/retweet?tweet_id={authorTweetID}"
        style:background-image="url({retweetIcon})"
        style:color="#009988"
      >
        <small>Twitterで</small>
        <span>RTする</span>
      </a>
      <a
        href="https://twitter.com/intent/tweet?in_reply_to={authorTweetID}"
        style:background-image="url({mentionIcon})"
        style:color="#3579d1"
      >
        <small>Twitterで</small>
        <span>コメントする</span>
      </a>
    {:else}
      <a
        href="https://twitter.com/intent/tweet?url={url}"
        style:background-image="url({mentionIcon})"
        style:color="#3579d1"
      >
        <small>Twitterで</small>
        <span>コメントする</span>
      </a>
    {/if}
  </section>

  <h1>Recent public mentions on Twitter</h1>
  <ol reversed>
    {#if mentions}
      {#each mentions as mention}
        <li>
          <img src={icon[verb[mention['wm-property']]]} alt="" />
          <a href={mention.url} class="no-color">
            <small title={mention.published || mention['wm-received']}>
              <time>
                {FormatUtility.date(mention.published || mention['wm-received'])}
              </time>
            </small>
            <span>
              <a href={mention.author.url}>
                <img src={mention.author.photo} alt={mention.author.name} />{mention.author.name}
                {#if /^https:\/\/twitter.com\/[^/]+\/?$/.test(mention.author.url)}
                  <small>(@{mention.author.url.split('/')[3]})</small>
                {/if}
              </a>
              {verb[mention['wm-property']]}.
            </span>
          </a>
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
