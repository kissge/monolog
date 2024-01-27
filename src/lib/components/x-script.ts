export const defineXScriptCustomElement = () => {
  class XScript extends HTMLElement {
    connectedCallback() {
      const script = document.createElement('script');
      Array.from(this.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));

      const iframe = document.createElement('iframe');
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '0';
      iframe.style.maxHeight = '100vh';
      iframe.srcdoc = '<body injected style="margin: 0">' + this.innerHTML + script.outerHTML;
      this.innerHTML = '';
      this.appendChild(iframe);

      setTimeout(function check() {
        if (iframe.contentDocument?.body?.hasAttribute('injected')) {
          const resize = () => {
            if (iframe.contentDocument?.body?.parentElement) {
              iframe.style.height = `${iframe.contentDocument.body.parentElement.offsetHeight}px`;
            }
          };
          new ResizeObserver(resize).observe(iframe.contentDocument.body);
          resize();
        } else {
          setTimeout(check, 250);
        }
      }, 1);
    }
  }

  if (!customElements.get('x-script')) {
    customElements.define('x-script', XScript);
  }
};
