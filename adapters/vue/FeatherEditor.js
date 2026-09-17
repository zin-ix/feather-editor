import { h, defineComponent, watch } from 'vue';
import { useFeather } from './useFeather.js';
import { StarterKit } from '../../src/extensions/index.js';

/**
 * FeatherEditor — drop-in Vue 3 component.
 *
 *   <FeatherEditor v-model="htmlContent" />
 *
 * Exposes the editor instance via a template ref: `ref.editor`.
 */
export const FeatherEditor = defineComponent({
  name: 'FeatherEditor',
  props: {
    modelValue: { type: String, default: undefined },
    content: { type: String, default: '' },
    placeholder: { type: String, default: undefined },
    toolbar: { type: [Boolean, Object], default: true },
    bubbleMenu: { type: [Boolean, Object], default: true },
    slashMenu: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false },
    attribution: { type: Boolean, default: true },
    class: { type: String, default: '' },
    extensions: { type: Array, default: () => StarterKit },
  },
  emits: ['update:modelValue', 'change', 'ready'],
  setup(props, { emit, expose }) {
    const initialContent = props.modelValue !== undefined ? props.modelValue : props.content;

    const api = useFeather({
      extensions: props.extensions?.length ? props.extensions : StarterKit,
      content: initialContent,
      placeholder: props.placeholder,
      toolbar: props.toolbar,
      bubbleMenu: props.bubbleMenu,
      slashMenu: props.slashMenu,
      readOnly: props.readOnly,
      attribution: props.attribution,
      onChange: (html, instance) => {
        emit('update:modelValue', html);
        emit('change', html, instance);
      },
    });

    watch(() => props.readOnly, (ro) => {
      if (!api.editor.value) return;
      ro ? api.editor.value.disable() : api.editor.value.enable();
    });

    watch(() => props.modelValue !== undefined ? props.modelValue : props.content, (val) => {
      const ed = api.editor.value;
      if (!ed || val === undefined) return;
      if (val !== ed.getHtml()) ed.setHtml(val);
    });

    expose({
      getEditor: () => api.editor.value,
      editor: api.editor,
      getHtml: api.getHtml,
      setHtml: api.setHtml,
      cmd: api.cmd,
      focus: api.focus,
    });

    return () => h('div', { ref: api.el, class: `feather-editor-container rune-editor-container ${props.class}`.trim() });
  },
});

export default FeatherEditor;
