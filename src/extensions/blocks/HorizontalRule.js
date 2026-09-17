import { uid } from '../../utils/id.js';
import { icons } from '../../ui/icons.js';

export const HorizontalRule = {
  name: 'horizontalRule',
  type: 'block',
  tag: 'hr',

  commands(editor) {
    return {
      insertHorizontalRule() {
        editor.history.saveNow();

        const hr = document.createElement('hr');
        hr.className = 'rune-hr feather-hr';
        hr.setAttribute('data-id', uid());

        // Insert after current block
        const currentBlock = editor.selection.getBlock();
        const after = currentBlock?.nextSibling || null;
        editor.content.insertBefore(hr, after);

        // Add a paragraph after so the user can keep typing
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        editor.content.insertBefore(p, hr.nextSibling);
        editor.selection.setAtStart(p);
        editor._notifyChange();
      },
    };
  },

  toolbarItem: {
    name: 'horizontalRule',
    icon: icons.horizontalRule,
    title: 'Horizontal Rule',
    action: 'insertHorizontalRule',
    isActive: () => false,
  },

  slashItem: {
    icon: icons.horizontalRule,
    title: 'Divider',
    description: 'A horizontal rule to separate sections',
    action: (editor) => editor.cmd('insertHorizontalRule'),
  },
};
