import { el } from '../../utils/dom.js';
import { uid } from '../../utils/id.js';
import { icons } from '../../ui/icons.js';

const CALLOUT_ICONS = [
  { name: 'lightbulb', icon: icons.lightbulb },
  { name: 'info', icon: icons.info },
  { name: 'alertTriangle', icon: icons.alertTriangle },
  { name: 'checkCircle', icon: icons.checkCircle },
  { name: 'xCircle', icon: icons.xCircle },
  { name: 'fileText', icon: icons.fileText },
  { name: 'zap', icon: icons.zap },
  { name: 'bookmark', icon: icons.bookmark },
  { name: 'star', icon: icons.star },
  { name: 'pin', icon: icons.pin },
  { name: 'flame', icon: icons.flame },
  { name: 'heart', icon: icons.heart },
  { name: 'helpCircle', icon: icons.helpCircle },
  { name: 'settings', icon: icons.settings },
  { name: 'smile', icon: icons.smile },
];

const COLORS = [
  { label: 'Yellow', value: 'yellow', bg: '#fdecc8', border: '#f5d687' },
  { label: 'Blue',   value: 'blue',   bg: '#ddebf1', border: '#a7c9da' },
  { label: 'Green',  value: 'green',  bg: '#ddedea', border: '#9bcfc5' },
  { label: 'Red',    value: 'red',    bg: '#fde8e3', border: '#f4b4a4' },
  { label: 'Purple', value: 'purple', bg: '#eae4f2', border: '#c4aee2' },
  { label: 'Gray',   value: 'gray',   bg: '#f1f1ef', border: '#d3d3ce' },
];

export const Callout = {
  name: 'callout',
  type: 'block',
  tag: 'div',
  match: (el) => el.dataset?.type === 'callout',

  commands(editor) {
    // Open the icon picker by pointer or keyboard (the icon is role=button).
    editor.content.addEventListener('click', (e) => {
      const icon = e.target.closest?.('.rune-callout-icon, .feather-callout-icon');
      if (!icon) return;
      e.preventDefault();
      _openIconPicker(editor, icon);
    });
    editor.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const icon = e.target.closest?.('.rune-callout-icon, .feather-callout-icon');
      if (!icon) return;
      e.preventDefault();
      _openIconPicker(editor, icon);
    });

    // Enter inside a callout body: keep the line break inside the body (the
    // native split would spawn a sibling <div> that breaks the flex layout),
    // and exit into a paragraph below when pressed on an empty trailing line.
    editor.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const start = range.startContainer;
      const startEl = start.nodeType === Node.TEXT_NODE ? start.parentElement : start;
      const body = startEl?.closest?.('.rune-callout-body, .feather-callout-body');
      if (!body || !editor.content.contains(body)) return;

      e.preventDefault();
      if (_atEmptyExitPoint(body, range)) {
        _exitCallout(editor, body);
      } else {
        document.execCommand('insertLineBreak');
        editor._notifyChange();
      }
    });

    return {
      insertCallout(iconValue = icons.lightbulb, color = 'yellow') {
        editor.history.saveNow();

        const wrap = document.createElement('div');
        wrap.className = `rune-callout feather-callout rune-callout--${color} feather-callout--${color}`;
        wrap.setAttribute('data-type', 'callout');
        wrap.setAttribute('data-id', uid());

        const icon = document.createElement('span');
        icon.className = 'rune-callout-icon feather-callout-icon';
        icon.setAttribute('contenteditable', 'false');
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('aria-label', 'Change callout icon');
        const resolvedIcon = icons[iconValue] || iconValue;
        icon.innerHTML = resolvedIcon;

        const body = document.createElement('div');
        body.className = 'rune-callout-body feather-callout-body';
        body.innerHTML = '<br>';

        wrap.appendChild(icon);
        wrap.appendChild(body);

        // The current block may live inside a container region (toggle body /
        // column), so insert relative to its parent, not editor.content.
        const currentBlock = editor.selection.getBlock();
        const parent = currentBlock?.parentNode || editor.content;
        if (currentBlock && currentBlock.textContent.trim() === '') {
          parent.replaceChild(wrap, currentBlock);
        } else if (currentBlock) {
          parent.insertBefore(wrap, currentBlock.nextSibling);
        } else {
          editor.content.appendChild(wrap);
        }

        editor.selection.setAtStart(body);
        editor._notifyChange();
      },
    };
  },

  toolbarItem: {
    name: 'callout',
    type: 'panel',
    icon: icons.callout,
    title: 'Callout',
    indicator: false,

    renderPanel(editor, close) {
      let selectedIcon = icons.lightbulb;
      let selectedColor = 'yellow';

      const wrap = el('div', { class: 'rune-panel-callout feather-panel-callout' });

      // Icon grid
      const iconLabel = el('div', { class: 'rune-panel-section-label feather-panel-section-label' }, 'ICON');
      const iconGrid  = el('div', { class: 'rune-panel-emoji-grid rune-panel-icon-grid feather-panel-icon-grid' });
      let activeIconBtn = null;

      for (const item of CALLOUT_ICONS) {
        const btn = el('button', { class: 'rune-panel-emoji-btn rune-panel-icon-btn feather-panel-icon-btn', type: 'button' });
        btn.innerHTML = item.icon;
        if (item.icon === selectedIcon) { btn.classList.add('is-active'); activeIconBtn = btn; }
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          selectedIcon = item.icon;
          activeIconBtn?.classList.remove('is-active');
          btn.classList.add('is-active');
          activeIconBtn = btn;
        });
        iconGrid.appendChild(btn);
      }

      // Color row
      const colorLabel = el('div', { class: 'rune-panel-section-label feather-panel-section-label' }, 'COLOR');
      const colorRow   = el('div', { class: 'rune-panel-callout-colors feather-panel-callout-colors' });
      let activeColorBtn = null;

      for (const c of COLORS) {
        const btn = el('button', { class: 'rune-panel-callout-color feather-panel-callout-color', type: 'button', title: c.label });
        btn.style.background   = c.bg;
        btn.style.borderColor  = c.border;
        if (c.value === selectedColor) { btn.classList.add('is-active'); activeColorBtn = btn; }
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          selectedColor = c.value;
          activeColorBtn?.classList.remove('is-active');
          btn.classList.add('is-active');
          activeColorBtn = btn;
        });
        colorRow.appendChild(btn);
      }

      // Insert button
      const insertBtn = el('button', { class: 'rune-panel-btn-primary feather-panel-btn-primary', type: 'button', style: 'width:100%;margin-top:10px' }, 'Insert Callout');
      insertBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        editor.cmd('insertCallout', selectedIcon, selectedColor);
        close();
      });

      wrap.appendChild(iconLabel);
      wrap.appendChild(iconGrid);
      wrap.appendChild(colorLabel);
      wrap.appendChild(colorRow);
      wrap.appendChild(insertBtn);
      return wrap;
    },

    isActive: (editor) => editor.selection.getBlock()?.dataset?.type === 'callout',
  },

  slashItem: {
    icon: icons.callout,
    title: 'Callout',
    description: 'Highlighted box with an icon',
    action: (editor) => editor.cmd('insertCallout'),
  },
};

// ── Enter handling inside a callout body ────────────────────

/** The node immediately before a collapsed caret, or null if text precedes it. */
function _nodeBeforeCaret(range) {
  const { startContainer: c, startOffset: o } = range;
  if (c.nodeType === Node.TEXT_NODE) return o === 0 ? c.previousSibling : null;
  return o > 0 ? c.childNodes[o - 1] : null;
}

/** True when the caret sits on an empty last line of the body (so Enter exits). */
function _atEmptyExitPoint(body, range) {
  // Anything but whitespace between the caret and the end of the body → stay.
  const tail = document.createRange();
  tail.setStart(range.endContainer, range.endOffset);
  tail.setEnd(body, body.childNodes.length);
  if (tail.cloneContents().textContent.trim() !== '') return false;
  // Empty body, or the caret is right after a <br> (an empty current line).
  if (body.textContent.trim() === '') return true;
  return _nodeBeforeCaret(range)?.nodeName === 'BR';
}

/** Leave the callout: drop the trailing empty line and add a paragraph after it. */
function _exitCallout(editor, body) {
  while (body.lastChild && body.lastChild.nodeName === 'BR' && body.childNodes.length > 1) {
    body.removeChild(body.lastChild);
  }
  const callout = body.closest('.rune-callout, .feather-callout');
  const p = document.createElement('p');
  p.innerHTML = '<br>';
  callout.parentNode.insertBefore(p, callout.nextSibling);
  editor.selection.setAtStart(p);
  editor._notifyChange();
}

// ── Inline icon picker (click icon in callout) ─────────────

function _openIconPicker(editor, iconEl) {
  // Remove any existing picker
  document.querySelector('.rune-callout-emoji-picker, .feather-callout-icon-picker')?.remove();

  const picker = document.createElement('div');
  picker.className = 'rune-callout-emoji-picker feather-callout-icon-picker rune-toolbar-popup feather-toolbar-popup';

  const grid = document.createElement('div');
  grid.className = 'rune-panel-emoji-grid rune-panel-icon-grid feather-panel-icon-grid';

  for (const item of CALLOUT_ICONS) {
    const btn = document.createElement('button');
    btn.className = 'rune-panel-emoji-btn rune-panel-icon-btn feather-panel-icon-btn';
    btn.type = 'button';
    btn.innerHTML = item.icon;
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => {
      iconEl.innerHTML = item.icon;
      picker.remove();
      editor._notifyChange();
    });
    grid.appendChild(btn);
  }

  picker.appendChild(grid);
  document.body.appendChild(picker);
  picker.querySelector('button')?.focus();   // move keyboard focus into the picker
  picker.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { picker.remove(); iconEl.focus?.(); }
  });

  // Position below the icon
  const r = iconEl.getBoundingClientRect();
  picker.style.top  = `${r.bottom + 5}px`;
  picker.style.left = `${r.left}px`;
  requestAnimationFrame(() => picker.classList.add('is-open'));

  // Close on outside click
  const close = (e) => {
    if (!picker.contains(e.target) && e.target !== iconEl) {
      picker.remove();
      document.removeEventListener('mousedown', close);
    }
  };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}
