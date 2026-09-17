import { icons } from '../../ui/icons.js';

export const Bold = {
  name: 'bold',
  type: 'mark',
  tag: 'strong',
  execCommand: 'bold',
  hasMark: (el) => el.tagName === 'STRONG' || el.tagName === 'B',

  keymap: {
    'Meta+b':    (editor) => editor.chain().toggleBold().run(),
    'Control+b': (editor) => editor.chain().toggleBold().run(),
  },

  toolbarItem: {
    name: 'bold',
    icon: icons.bold,
    title: 'Bold (⌘B)',
    action: 'toggleBold',
    isActive: (editor) => editor.isActive('bold'),
  },
};
