import { icons } from '../../ui/icons.js';

export const Code = {
  name: 'code',
  type: 'mark',
  tag: 'code',

  commands(editor) {
    return {
      toggleInlineCode() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;

        // Check if selection is already wrapped in <code>
        const range = sel.getRangeAt(0);
        const parent = range.commonAncestorContainer;
        const codeEl = parent.nodeType === 1 && parent.tagName === 'CODE'
          ? parent
          : parent.parentElement?.closest('code');

        if (codeEl) {
          // Unwrap
          const text = document.createTextNode(codeEl.textContent);
          codeEl.replaceWith(text);
        } else {
          // Wrap in <code>
          const code = document.createElement('code');
          code.appendChild(range.extractContents());
          range.insertNode(code);
        }
        editor._notifyChange();
      },
    };
  },

  keymap: {
    'Meta+e':    (editor) => editor.cmd('toggleInlineCode'),
    'Control+e': (editor) => editor.cmd('toggleInlineCode'),
  },

  toolbarItem: {
    name: 'code',
    icon: icons.code,
    title: 'Inline Code (⌘E)',
    action: 'toggleInlineCode',
    isActive: (editor) => editor.isActive('code'),
  },
};
