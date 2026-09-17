import { el } from '../../utils/dom.js';

export const FontSize = {
  name: 'fontSize',
  type: 'mark',
  tag: 'span',
  hasMark: (el) => el.tagName === 'SPAN' && !!el.style.fontSize,

  commands(editor) {
    return {
      setFontSize(size) {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        const frag = range.extractContents();
        // Remove existing font-size from nested spans within selection to prevent redundant nesting
        frag.querySelectorAll?.('span[style*="font-size"]').forEach(s => {
          s.style.fontSize = '';
          if (!s.getAttribute('style')?.trim()) s.replaceWith(...s.childNodes);
        });
        const div = document.createElement('div');
        div.appendChild(frag);
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.innerHTML = div.innerHTML;
        range.insertNode(span);
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
        editor._notifyChange();
      },
      clearFontSize() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        const frag = range.extractContents();
        frag.querySelectorAll?.('span[style*="font-size"]').forEach(s => {
          s.style.fontSize = '';
          if (!s.getAttribute('style')?.trim()) s.replaceWith(...s.childNodes);
        });
        range.insertNode(frag);
        editor._notifyChange();
      },
    };
  },

  toolbarItem: {
    name: 'fontSize',
    type: 'custom',

    render(editor) {
      const wrap = el('div', { class: 'feather-fontsize-wrap rune-fontsize-wrap', title: 'Font Size' });

      const input = el('input', {
        type: 'number',
        class: 'feather-fontsize-input rune-fontsize-input',
        placeholder: '–',
        min: '6',
        max: '200',
        'aria-label': 'Font size',
      });

      const readCurrent = () => {
        const sel = window.getSelection();
        if (!sel || !sel.focusNode) return '';
        let node = sel.focusNode;
        if (node.nodeType === 3) node = node.parentNode;
        while (node && node !== editor.content) {
          if (node.style?.fontSize) {
            const v = node.style.fontSize;
            if (v.endsWith('px')) return parseInt(v, 10).toString();
            if (v.endsWith('em')) return Math.round(parseFloat(v) * 16).toString();
            if (v.endsWith('pt')) return Math.round(parseFloat(v) * 1.333).toString();
          }
          node = node.parentNode;
        }
        return '';
      };

      let savedRange = null;

      const saveRange = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
          savedRange = sel.getRangeAt(0).cloneRange();
        }
      };

      const restoreAndApply = () => {
        const val = parseInt(input.value, 10);
        if (!val || val < 6 || val > 200) { input.value = ''; return; }
        if (savedRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        editor.cmd('setFontSize', `${val}px`);
        input.blur();
      };

      input.addEventListener('mousedown', (e) => e.stopPropagation());
      input.addEventListener('focus', () => {
        saveRange();
        input.value = readCurrent();
        input.select();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); restoreAndApply(); }
        if (e.key === 'Escape') { input.value = ''; input.blur(); }
      });
      input.addEventListener('blur', () => {
        if (input.value) restoreAndApply();
        else input.value = '';
      });

      const updateVal = () => {
        if (document.activeElement !== input) {
          const curr = readCurrent();
          input.value = curr;
          input.placeholder = curr || '–';
        }
      };

      const bus = editor.events || editor;
      if (typeof bus.on === 'function') {
        bus.on('selectionchange', updateVal);
        bus.on('change', updateVal);
      }

      wrap.appendChild(input);
      return wrap;
    },

    isActive: (editor) => editor.isActive('fontSize'),
  },
};
