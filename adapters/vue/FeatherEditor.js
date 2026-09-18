import { h, defineComponent, watch, computed } from 'vue';
import { useFeather } from './useFeather.js';
import { StarterKit } from '../../src/extensions/index.js';

/**
 * FeatherEditor — drop-in Vue 3 component.
 *
 *   <FeatherEditor v-model="content" placeholder="Enter specifications..." paper="a4" />
 *
 * Drop-in replacement for SimpleEditorVue with HTML, Markdown, or Plain Text v-model support
 * and built-in paper sizing (A4, Letter, Legal, A5, Fluid).
 */
export const FeatherEditor = defineComponent({
  name: 'FeatherEditor',
  props: {
    modelValue: { type: [String, Object], default: undefined },
    content: { type: [String, Object], default: '' },
    placeholder: { type: String, default: "Write something, or type '/' for commands…" },
    outputFormat: {
      type: String,
      default: 'html', // 'html' | 'markdown' | 'text' | 'json'
      validator: (v) => ['html', 'markdown', 'text', 'json'].includes(v),
    },
    paper: { type: String, default: undefined }, // 'a4' | 'letter' | 'legal' | 'a5' | 'fluid'
    paperSize: { type: String, default: undefined }, // alias
    landscape: { type: Boolean, default: false },
    toolbar: { type: [Boolean, Object], default: true },
    bubbleMenu: { type: [Boolean, Object], default: true },
    slashMenu: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }, // alias
    disabled: { type: Boolean, default: false }, // alias
    attribution: { type: Boolean, default: true },
    minHeight: { type: [String, Number], default: undefined },
    margin: { type: String, default: undefined }, // '1in', '20mm', '0.5in', 'narrow', 'normal', 'moderate', 'wide'
    pageMargin: { type: String, default: undefined }, // alias
    class: { type: String, default: '' },
    extensions: { type: Array, default: () => StarterKit },
  },
  emits: ['update:modelValue', 'change', 'ready'],
  setup(props, { emit, expose }) {
    const isLocked = computed(() => props.readOnly || props.readonly || props.disabled);
    const selectedPaper = computed(() => props.paper || props.paperSize);
    const initialContent = props.modelValue !== undefined ? props.modelValue : props.content;

    function getFormattedOutput(editorInstance) {
      if (!editorInstance) return '';
      switch (props.outputFormat) {
        case 'markdown':
          return editorInstance.getMarkdown();
        case 'text':
          return editorInstance.getText();
        case 'json':
          return editorInstance.getJSON();
        case 'html':
        default:
          return editorInstance.getHtml();
      }
    }

    const api = useFeather({
      extensions: props.extensions?.length ? props.extensions : StarterKit,
      content: initialContent,
      placeholder: props.placeholder,
      toolbar: props.toolbar,
      bubbleMenu: props.bubbleMenu,
      slashMenu: props.slashMenu,
      readOnly: isLocked.value,
      attribution: props.attribution,
      onChange: (rawHtml, instance) => {
        const val = getFormattedOutput(instance);
        emit('update:modelValue', val);
        emit('change', val, instance);
      },
    });

    watch(isLocked, (locked) => {
      if (!api.editor.value) return;
      locked ? api.editor.value.disable() : api.editor.value.enable();
    });

    watch(() => props.modelValue !== undefined ? props.modelValue : props.content, (newVal) => {
      const ed = api.editor.value;
      if (!ed || newVal === undefined || newVal === null) return;
      const currentVal = getFormattedOutput(ed);
      if (newVal !== currentVal) {
        if (props.outputFormat === 'markdown' && typeof newVal === 'string') {
          ed.setMarkdown(newVal);
        } else if (props.outputFormat === 'json' && typeof newVal === 'object') {
          ed.setJSON(newVal);
        } else {
          ed.setHtml(String(newVal));
        }
      }
    });

    expose({
      getEditor: () => api.editor.value,
      editor: api.editor,
      getHtml: api.getHtml,
      setHtml: api.setHtml,
      getMarkdown: () => api.editor.value?.getMarkdown() ?? '',
      setMarkdown: (md) => api.editor.value?.setMarkdown(md),
      getText: () => api.editor.value?.getText() ?? '',
      getJSON: () => api.editor.value?.getJSON() ?? null,
      cmd: api.cmd,
      focus: api.focus,
    });

    const styleObj = computed(() => {
      const styles = {};
      if (props.minHeight) {
        const minH = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
        styles['--feather-canvas-min-height'] = minH;
      } else if (selectedPaper.value === 'a4') {
        styles['--feather-canvas-min-height'] = props.landscape ? '700px' : '1020px';
      } else if (selectedPaper.value === 'letter') {
        styles['--feather-canvas-min-height'] = props.landscape ? '720px' : '950px';
      }

      const rawMargin = props.margin || props.pageMargin;
      if (rawMargin) {
        const marginPresets = {
          normal: '1in',
          standard: '1in',
          narrow: '0.5in',
          moderate: '1in 0.75in',
          wide: '1in 2in',
        };
        styles['--feather-paper-margin'] = marginPresets[rawMargin] || rawMargin;
      }

      return styles;
    });

    const paperClasses = computed(() => {
      const p = selectedPaper.value;
      if (!p) return '';
      return `feather-paper-sheet feather-paper--${p} ${props.landscape ? 'feather-paper--landscape' : ''}`.trim();
    });

    return () => h('div', {
      ref: api.el,
      class: `feather-editor-container rune-editor-container ${paperClasses.value} ${props.class}`.trim(),
      style: styleObj.value,
    });
  },
});

export default FeatherEditor;
