import { icons } from '../../ui/icons.js';

export const Superscript = {
  name: 'superscript',
  type: 'mark',
  tag: 'sup',
  execCommand: 'superscript',

  toolbarItem: {
    name: 'superscript',
    icon: icons.superscript,
    title: 'Superscript',
    action: 'toggleSuperscript',
    isActive: (editor) => {
      try { return document.queryCommandState('superscript'); } catch { return false; }
    },
  },
};
