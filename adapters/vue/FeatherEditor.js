import { h, defineComponent, watch, computed } from 'vue';
import { useFeather } from './useFeather.js';
import { StarterKit } from '../../src/extensions/index.js';

/**
 * FeatherEditor — drop-in Vue 3 component.
 *
 *   <FeatherEditor v-model="content" placeholder="Enter specifications..." />
 *
 * Drop-in replacement for SimpleEditorVue with HTML, Markdown, or Plain Text v-model support.
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
    toolbar: { type: [Boolean, Object], default: true },
    bubbleMenu: { type: [Boolean, Object], default: true },
    slashMenu: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }, // alias
    disabled: { type: Boolean, default: false }, // alias
    attribution: { type: Boolean, default: true },
    minHeight: { type: [String, Number], default: undefined },
    class: { type: String, default: '' },
    extensions: { type: Array, default: () => StarterKit },
  },
  emits: ['update:modelValue', 'change', 'ready'],
  setup(props, { emit, expose }) {
    const isLocked = computed(() => props.readOnly || props.readonly || props.disabled);
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
      if (!props.minHeight) return {};
      const minH = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
      return { '--feather-canvas-min-height': minH };
    });

    return () => h('div', {
      ref: api.el,
      class: `feather-editor-container rune-editor-container ${props.class}`.trim(),
      style: styleObj.value,
    });
  },
});

export default FeatherEditor;
