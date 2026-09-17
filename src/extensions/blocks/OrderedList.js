import { icons } from '../../ui/icons.js';

export const OrderedList = {
  name: 'orderedList',
  type: 'block',
  tag: 'ol',

  commands(editor) {
    return {
      toggleOrderedList() {
        const block = editor.selection.getBlock();
        if (!block) return;
        editor.history.saveNow();
        if (block.tagName === 'OL') {
          const frag = document.createDocumentFragment();
          for (const li of block.querySelectorAll('li')) {
            const p = document.createElement('p');
            p.innerHTML = li.innerHTML;
            frag.appendChild(p);
          }
          editor.content.replaceChild(frag, block);
        } else {
          document.execCommand('insertOrderedList');
        }
        editor._notifyChange();
      },
    };
  },

  keymap: {
    'Meta+Shift+7':    (editor) => editor.cmd('toggleOrderedList'),
    'Control+Shift+7': (editor) => editor.cmd('toggleOrderedList'),
  },

  toolbarItem: {
    name: 'orderedList',
    icon: icons.orderedList,
    title: 'Ordered List',
    action: 'toggleOrderedList',
    isActive: (editor) => editor.isActive('orderedList'),
  },

  slashItem: {
    icon: icons.orderedList,
    title: 'Numbered List',
    description: 'Ordered list with numbers',
    action: (editor) => editor.cmd('toggleOrderedList'),
  },
};
