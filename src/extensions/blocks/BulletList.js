import { icons } from '../../ui/icons.js';

export const BulletList = {
  name: 'bulletList',
  type: 'block',
  tag: 'ul',

  commands(editor) {
    return {
      toggleBulletList() {
        const block = editor.selection.getBlock();
        if (!block) return;
        editor.history.saveNow();
        if (block.tagName === 'UL') {
          // Unwrap list items into paragraphs
          const frag = document.createDocumentFragment();
          for (const li of block.querySelectorAll('li')) {
            const p = document.createElement('p');
            p.innerHTML = li.innerHTML;
            frag.appendChild(p);
          }
          editor.content.replaceChild(frag, block);
        } else {
          document.execCommand('insertUnorderedList');
        }
        editor._notifyChange();
      },
    };
  },

  keymap: {
    'Meta+Shift+8':    (editor) => editor.cmd('toggleBulletList'),
    'Control+Shift+8': (editor) => editor.cmd('toggleBulletList'),
  },

  toolbarItem: {
    name: 'bulletList',
    icon: icons.bulletList,
    title: 'Bullet List',
    action: 'toggleBulletList',
    isActive: (editor) => editor.isActive('bulletList'),
  },

  slashItem: {
    icon: icons.bulletList,
    title: 'Bullet List',
    description: 'Unordered list of items',
    action: (editor) => editor.cmd('toggleBulletList'),
  },
};
