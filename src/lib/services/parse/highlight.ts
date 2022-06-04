import type { marked } from 'marked';
import HighlightJS from 'highlight.js';

const HighlightExtension: marked.MarkedExtension = {
  highlight(code, language) {
    if (language) {
      return HighlightJS.highlight(code, { language }).value;
    }
  },
};

export default HighlightExtension;
