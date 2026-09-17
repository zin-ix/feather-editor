import { icons } from '../../ui/icons.js';

export const Paragraph = {
  name: 'paragraph',
  type: 'block',
  tag: 'p',

  commands(editor) {
    return {
      setParagraph: () => editor.cmd('setBlock', 'paragraph'),
    };
  },

  toolbarItem: {
    name: 'paragraph',
    icon: icons.paragraph,
    title: 'Paragraph',
    action: 'setParagraph',
    isActive: (editor) => editor.isActive('paragraph'),
  },

  slashItem: {
    icon: icons.paragraph,
    title: 'Paragraph',
    description: 'Plain paragraph text',
    action: (editor) => editor.chain().setParagraph().run(),
  },
};
