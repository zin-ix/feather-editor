import { icons } from '../../ui/icons.js';

export const Italic = {
  name: 'italic',
  type: 'mark',
  tag: 'em',
  execCommand: 'italic',
  hasMark: (el) => el.tagName === 'EM' || el.tagName === 'I',

  keymap: {
    'Meta+i':    (editor) => editor.chain().toggleItalic().run(),
    'Control+i': (editor) => editor.chain().toggleItalic().run(),
  },

  toolbarItem: {
    name: 'italic',
    icon: icons.italic,
    title: 'Italic (⌘I)',
    action: 'toggleItalic',
    isActive: (editor) => editor.isActive('italic'),
  },
};
