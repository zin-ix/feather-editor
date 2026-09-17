import { icons } from '../../ui/icons.js';

export const Strike = {
  name: 'strike',
  type: 'mark',
  tag: 's',
  execCommand: 'strikeThrough',
  hasMark: (el) => el.tagName === 'S' || el.tagName === 'STRIKE' || el.tagName === 'DEL',

  keymap: {
    'Meta+Shift+s':    (editor) => editor.chain().toggleStrike().run(),
    'Control+Shift+s': (editor) => editor.chain().toggleStrike().run(),
  },

  toolbarItem: {
    name: 'strike',
    icon: icons.strike,
    title: 'Strikethrough',
    action: 'toggleStrike',
    isActive: (editor) => editor.isActive('strike'),
  },
};
