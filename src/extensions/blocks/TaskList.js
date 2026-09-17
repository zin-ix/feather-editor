import { uid } from '../../utils/id.js';
import { icons } from '../../ui/icons.js';

export const TaskList = {
  name: 'taskList',
  type: 'block',
  tag: 'ul',  // shares tag with BulletList — resolved by match function
  match: (el) => el.classList.contains('rune-task-list') || el.classList.contains('feather-task-list'),

  commands(editor) {
    const _toggle = (cb) => {
      const li = cb.closest('.rune-task-item, .feather-task-item');
      if (!li) return;
      const checked = li.dataset.checked === 'true';
      li.dataset.checked = checked ? 'false' : 'true';
      cb.textContent = checked ? '☐' : '☑';
      cb.setAttribute('aria-checked', String(!checked));
      editor._notifyChange();
    };

    // Toggle on pointer…
    editor.content.addEventListener('mousedown', (e) => {
      const cb = e.target.closest?.('.rune-task-checkbox, .feather-task-checkbox');
      if (!cb) return;
      e.preventDefault();
      _toggle(cb);
    });

    // …and keyboard: Space on the checkbox toggles without inserting a space
    editor.content.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      const cb = e.target.closest?.('.rune-task-checkbox, .feather-task-checkbox');
      if (!cb) return;
      e.preventDefault();
      _toggle(cb);
    });

    // Backspace at the start of a task item: remove checkbox, turn into a plain list/paragraph
    editor.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Backspace') return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const li = range.startContainer?.parentElement?.closest?.('.rune-task-item, .feather-task-item');
      if (!li) return;

      const content = li.querySelector('.rune-task-content, .feather-task-content');
      if (!content) return;

      // Caret is at the start of the text
      if (range.startContainer === content && range.startOffset === 0 ||
          range.startContainer === content.firstChild && range.startOffset === 0) {
        e.preventDefault();
        const p = document.createElement('p');
        p.innerHTML = content.innerHTML || '<br>';
        const ul = li.closest('.rune-task-list, .feather-task-list');
        if (ul.children.length === 1) {
          ul.replaceWith(p);
        } else {
          li.replaceWith(p);
        }
        editor.selection.setAtStart(p);
        editor._notifyChange();
      }
    });

    // Enter inside a task item creates a new task item
    editor.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const li = range.startContainer?.parentElement?.closest?.('.rune-task-item, .feather-task-item');
      if (!li) return;

      const content = li.querySelector('.rune-task-content, .feather-task-content');
      if (!content) return;

      e.preventDefault();

      // If the item is empty, pressing Enter exits the task list into a paragraph
      if (content.textContent.trim() === '') {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        const ul = li.closest('.rune-task-list, .feather-task-list');
        if (ul.children.length === 1) {
          ul.replaceWith(p);
        } else {
          li.remove();
          ul.after(p);
        }
        editor.selection.setAtStart(p);
        editor._notifyChange();
        return;
      }

      // Otherwise split the current line / spawn next unchecked item
      editor.history.saveNow();
      const nextLi = _makeTaskItem('');
      li.after(nextLi);
      editor.selection.setAtStart(nextLi.querySelector('.rune-task-content, .feather-task-content'));
      editor._notifyChange();
    });

    return {
      insertTaskList() {
        editor.history.saveNow();
        const ul = document.createElement('ul');
        ul.className = 'rune-task-list feather-task-list';
        ul.setAttribute('data-type', 'task-list');
        ul.setAttribute('data-id', uid());
        const li = _makeTaskItem('');
        ul.appendChild(li);

        const cur = editor.selection.getBlock();
        const parent = cur?.parentNode || editor.content;
        if (cur && cur.textContent.trim() === '') {
          parent.replaceChild(ul, cur);
        } else if (cur) {
          parent.insertBefore(ul, cur.nextSibling);
        } else {
          editor.content.appendChild(ul);
        }

        editor.selection.setAtStart(li.querySelector('.rune-task-content, .feather-task-content'));
        editor._notifyChange();
      },
    };
  },

  toolbarItem: {
    name: 'taskList',
    icon: icons.taskList,
    title: 'Task List',
    action: 'insertTaskList',
    isActive: (editor) => editor.selection.getBlock()?.dataset?.type === 'task-list',
  },

  slashItem: {
    icon: icons.taskList,
    title: 'Task List',
    description: 'Checklist of to-do items',
    action: (editor) => editor.cmd('insertTaskList'),
  },
};

function _makeTaskItem(text) {
  const li = document.createElement('li');
  li.className = 'rune-task-item';
  li.setAttribute('data-checked', 'false');

  const cb = document.createElement('span');
  cb.className = 'rune-task-checkbox';
  cb.setAttribute('contenteditable', 'false');
  cb.setAttribute('role', 'checkbox');
  cb.setAttribute('tabindex', '0');
  cb.setAttribute('aria-checked', 'false');
  cb.textContent = '☐';

  const content = document.createElement('span');
  content.className = 'rune-task-content';
  if (text) content.textContent = text;
  else content.innerHTML = '<br>';

  li.appendChild(cb);
  li.appendChild(content);
  return li;
}
