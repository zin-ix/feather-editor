import { icons } from '../../ui/icons.js';

export const Subscript = {
  name: 'subscript',
  type: 'mark',
  tag: 'sub',
  execCommand: 'subscript',

  toolbarItem: {
    name: 'subscript',
    icon: icons.subscript,
    title: 'Subscript',
    action: 'toggleSubscript',
    isActive: (editor) => {
      try { return document.queryCommandState('subscript'); } catch { return false; }
    },
  },
};
