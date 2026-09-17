import { icons } from '../../ui/icons.js';

export const Underline = {
  name: 'underline',
  type: 'mark',
  tag: 'u',
  execCommand: 'underline',
  hasMark: (el) => el.tagName === 'U',

  keymap: {
    'Meta+u':    (editor) => editor.chain().toggleUnderline().run(),
    'Control+u': (editor) => editor.chain().toggleUnderline().run(),
  },

  toolbarItem: {
    name: 'underline',
    icon: icons.underline,
    title: 'Underline (⌘U)',
    action: 'toggleUnderline',
    isActive: (editor) => editor.isActive('underline'),
  },
};
