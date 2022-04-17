export const defineCustomElement = () => {
  class XScript extends HTMLElement {
    connectedCallback() {
      const script = document.createElement('script');
      Array.from(this.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));

      const iframe = document.createElement('iframe');
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '0';
      iframe.srcdoc = '<body style="margin: 0">' + this.innerHTML + script.outerHTML;
      this.innerHTML = '';
      this.appendChild(iframe);

      for (let i = 0; i < 5000; i += 100) {
        setTimeout(() => {
          iframe.style.height = (iframe.contentDocument?.body.clientHeight || 0) + 30 + 'px';
        }, i);
      }
    }
  }

  customElements.define('x-script', XScript);
};
