import { el } from '../../utils/dom.js';

const ALIGNMENTS = [
  {
    value: 'left',
    label: 'Align Left',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="5" x2="21" y2="5"/>
      <line x1="3" y1="10" x2="13" y2="10"/>
      <line x1="3" y1="15" x2="17" y2="15"/>
      <line x1="3" y1="20" x2="11" y2="20"/>
    </svg>`,
  },
  {
    value: 'center',
    label: 'Align Center',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="5" x2="21" y2="5"/>
      <line x1="6" y1="10" x2="18" y2="10"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="8" y1="20" x2="16" y2="20"/>
    </svg>`,
  },
  {
    value: 'right',
    label: 'Align Right',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="5" x2="21" y2="5"/>
      <line x1="11" y1="10" x2="21" y2="10"/>
      <line x1="7" y1="15" x2="21" y2="15"/>
      <line x1="13" y1="20" x2="21" y2="20"/>
    </svg>`,
  },
  {
    value: 'justify',
    label: 'Justify',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="5" x2="21" y2="5"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="3" y1="20" x2="15" y2="20"/>
    </svg>`,
  },
];

export const TextAlign = {
  name: 'textAlign',
  type: 'formatting',

  commands(editor) {
    const setAlign = (align) => {
      const sel = editor.selection;
      let targets = [];
      if (sel.isCollapsed) {
        const t = sel.getFormattingTarget();
        if (t) targets = [t];
      } else {
        const range = sel.range;
        if (range) {
          const leaves = [...editor.content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre')].filter(el => {
            try { return range.intersectsNode(el); } catch { return false; }
          });
          if (leaves.length > 0) {
            targets = leaves;
          } else {
            const blocks = sel.getSelectedBlocks();
            targets = blocks.length > 0 ? blocks : [sel.getFormattingTarget()];
          }
        } else {
          const t = sel.getFormattingTarget();
          if (t) targets = [t];
        }
      }
      editor.history.saveNow();
      for (const block of targets) {
        if (!block) continue;
        block.style.textAlign = (align === 'left') ? '' : align;
      }
      editor._notifyChange();
    };

    return {
      setTextAlign: setAlign,
      alignLeft: () => setAlign('left'),
      alignCenter: () => setAlign('center'),
      alignRight: () => setAlign('right'),
      alignJustify: () => setAlign('justify'),
    };
  },

  toolbarItem: {
    name: 'textAlign',
    type: 'panel',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="5" x2="21" y2="5"/>
      <line x1="3" y1="10" x2="14" y2="10"/>
      <line x1="3" y1="15" x2="17" y2="15"/>
      <line x1="3" y1="20" x2="21" y2="20"/>
    </svg>`,
    title: 'Text Align (Left, Center, Right, Justify)',
    indicator: false,

    renderPanel(editor, close) {
      const wrap = el('div', { class: 'feather-panel-align rune-panel-align' });
      const label = el('div', { class: 'feather-panel-section-label rune-panel-section-label' }, 'ALIGNMENT');
      wrap.appendChild(label);

      const block = editor.selection.getFormattingTarget();
      const cur = block?.style.textAlign || 'left';

      const row = el('div', { class: 'feather-panel-align-row rune-panel-align-row' });
      for (const a of ALIGNMENTS) {
        const btn = el('button', { class: 'feather-panel-align-btn rune-panel-align-btn', type: 'button', title: a.label });
        btn.innerHTML = a.icon;
        const isSelected = (cur === a.value) || (cur === '' && a.value === 'left');
        if (isSelected) btn.classList.add('is-active');

        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          editor.cmd('setTextAlign', a.value);
          close();
        });
        row.appendChild(btn);
      }
      wrap.appendChild(row);
      return wrap;
    },

    isActive(editor) {
      const block = editor.selection.getFormattingTarget();
      const align = block?.style.textAlign;
      return !!(align && align !== '' && align !== 'left');
    },
  },

  toolbarItems: [
    {
      name: 'alignLeft',
      title: 'Align Left',
      icon: ALIGNMENTS[0].icon,
      action: 'setTextAlign',
      args: ['left'],
      isActive: (editor) => {
        const block = editor.selection.getFormattingTarget();
        const a = block?.style.textAlign;
        return !a || a === 'left';
      },
    },
    {
      name: 'alignCenter',
      title: 'Align Center',
      icon: ALIGNMENTS[1].icon,
      action: 'setTextAlign',
      args: ['center'],
      isActive: (editor) => editor.selection.getFormattingTarget()?.style.textAlign === 'center',
    },
    {
      name: 'alignRight',
      title: 'Align Right',
      icon: ALIGNMENTS[2].icon,
      action: 'setTextAlign',
      args: ['right'],
      isActive: (editor) => editor.selection.getFormattingTarget()?.style.textAlign === 'right',
    },
    {
      name: 'alignJustify',
      title: 'Justify',
      icon: ALIGNMENTS[3].icon,
      action: 'setTextAlign',
      args: ['justify'],
      isActive: (editor) => editor.selection.getFormattingTarget()?.style.textAlign === 'justify',
    },
  ],
};
