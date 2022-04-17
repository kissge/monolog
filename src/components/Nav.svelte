<script lang="ts">
  export let segment: string;
</script>

<nav>
  <ul>
    <li><a rel="prefetch" aria-current={segment === undefined ? 'page' : undefined} href="/">articles</a></li>
    <li><a rel="prefetch" aria-current={segment === 'about' ? 'page' : undefined} href="/about">about</a></li>
  </ul>
</nav>

<style type="text/sass" lang="sass">
nav
  padding: 0 1em
  border-bottom: 1px solid rgba(179, 72, 36, 0.527)
  text-shadow: 0 0 8px #fff, 0 0 8px #fff, 0 0 8px #fff
  font-weight: 300

ul
  margin: 0
  padding: 0

  &::after
    display: block
    clear: both
    content: ''

li
  display: block
  float: left
  margin: 0 0.5em

  &:hover
    background: #ffffff77

[aria-current]
  position: relative
  display: inline-block

  &::after
    position: absolute
    bottom: -1px
    left: 0
    display: block
    width: 100%
    height: 3px
    background-color: rgb(255, 62, 0)
    content: ''

a
  display: block
  padding: 1em 0.5em
  text-decoration: none

:global(.scrolled-down)
  nav
    position: fixed
    top: 0
    left: 0
    z-index: 19920928
    width: 100%

    backdrop-filter: blur(8px)
</style>
