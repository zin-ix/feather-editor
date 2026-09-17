import { icons } from '../../ui/icons.js';

export const Blockquote = {
  name: 'blockquote',
  type: 'block',
  tag: 'blockquote',

  commands(editor) {
    return {
      toggleBlockquote() {
        const block = editor.selection.getBlock();
        if (!block) return;
        editor.history.saveNow();
        if (block.tagName === 'BLOCKQUOTE') {
          const p = document.createElement('p');
          p.innerHTML = block.innerHTML;
          editor.content.replaceChild(p, block);
          editor.selection.setAtEnd(p);
        } else {
          document.execCommand('formatBlock', false, 'blockquote');
        }
        editor._notifyChange();
      },
    };
  },

  keymap: {
    'Meta+Shift+b':    (editor) => editor.cmd('toggleBlockquote'),
    'Control+Shift+b': (editor) => editor.cmd('toggleBlockquote'),
  },

  toolbarItem: {
    name: 'blockquote',
    icon: icons.blockquote,
    title: 'Blockquote',
    action: 'toggleBlockquote',
    isActive: (editor) => editor.isActive('blockquote'),
  },

  slashItem: {
    icon: icons.blockquote,
    title: 'Quote',
    description: 'Capture a quote or callout',
    action: (editor) => editor.cmd('toggleBlockquote'),
  },
};
