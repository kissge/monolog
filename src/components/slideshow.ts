import type { HTMLString } from '$lib/@types';
import './slideshow.sass';

export default function startSlideshow(source: HTMLString) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('slideshow-wrapper');
  source
    .split(/(<h1(?:>| [^>]*>)|<hr\s*\/?>)/)
    .flatMap(function (chunk, i, all) {
      if (i === 0 && chunk.trim()) {
        return { html: chunk };
      }

      if (i % 2 === 0) {
        return [];
      }

      const content = all[i + 1];
      const comment = content.match(/<!--[\s-]*(.+?)[\s-]*-->/);
      return { html: chunk + content, classList: comment?.[1] };
    })
    .forEach(({ html, classList }) => {
      const page = document.createElement('div');
      if (classList) {
        page.className = classList;
      }
      page.classList.add('slideshow-page-wrapper');
      const slide = document.createElement('div');
      slide.classList.add('slideshow-page');
      slide.innerHTML = postprocess(html as HTMLString);
      page.appendChild(slide);
      wrapper.appendChild(page);
    });
  document.body.appendChild(wrapper);

  wrapper.querySelectorAll('figure').forEach((figure) => {
    figure.addEventListener('click', () => figure.classList.toggle('zoom'));
  });
}

function postprocess(source: HTMLString) {
  return source
    .split(/(<[^>]+>)/)
    .map((chunk, i) => {
      if (i % 2 === 1) {
        // HTML tag
        return chunk;
      }

      return chunk.replace(/[（(].+?[)）]/g, (paren) => {
        return '<small class="paren">' + paren + '</small>';
      });
    })
    .join('');
}
