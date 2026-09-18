<template>
  <div
    ref="editorRef"
    :class="[
      'feather-editor-container',
      'rune-editor-container',
      paperClasses,
      customClass
    ]"
    :style="canvasStyle"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Editor, StarterKit } from '../../src/index.js';
import '../../styles/feather.css';

const props = defineProps({
  modelValue: { type: [String, Object], default: undefined },
  content: { type: [String, Object], default: '' },
  placeholder: { type: String, default: "Write something, or type '/' for commands…" },
  outputFormat: {
    type: String,
    default: 'html',
    validator: (v) => ['html', 'markdown', 'text', 'json'].includes(v),
  },
  paper: { type: String, default: undefined }, // 'a4' | 'letter' | 'legal' | 'a5' | 'fluid'
  paperSize: { type: String, default: undefined },
  landscape: { type: Boolean, default: false },
  toolbar: { type: [Boolean, Object], default: true },
  bubbleMenu: { type: [Boolean, Object], default: true },
  slashMenu: { type: Boolean, default: true },
  readOnly: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  attribution: { type: Boolean, default: true },
  minHeight: { type: [String, Number], default: undefined },
  customClass: { type: String, default: '' },
  extensions: { type: Array, default: () => StarterKit },
});

const emit = defineEmits(['update:modelValue', 'change', 'ready']);
const editorRef = ref(null);
let editor = null;

const isLocked = computed(() => props.readOnly || props.readonly || props.disabled);
const selectedPaper = computed(() => props.paper || props.paperSize);

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

onMounted(() => {
  if (!editorRef.value) return;

  const initialContent = props.modelValue !== undefined ? props.modelValue : props.content;

  editor = new Editor(editorRef.value, {
    content: initialContent,
    placeholder: props.placeholder,
    extensions: props.extensions?.length ? props.extensions : StarterKit,
    toolbar: props.toolbar,
    bubbleMenu: props.bubbleMenu,
    slashMenu: props.slashMenu,
    readOnly: isLocked.value,
    attribution: props.attribution,
    onChange(html, inst) {
      const val = getFormattedOutput(inst);
      emit('update:modelValue', val);
      emit('change', val, inst);
    },
  });

  emit('ready', editor);
});

onBeforeUnmount(() => {
  editor?.destroy();
  editor = null;
});

watch(isLocked, (val) => {
  if (!editor) return;
  val ? editor.disable() : editor.enable();
});

watch(() => props.modelValue !== undefined ? props.modelValue : props.content, (newVal) => {
  if (!editor || newVal === undefined || newVal === null) return;
  const currentVal = getFormattedOutput(editor);
  if (newVal !== currentVal) {
    if (props.outputFormat === 'markdown' && typeof newVal === 'string') {
      editor.setMarkdown(newVal);
    } else if (props.outputFormat === 'json' && typeof newVal === 'object') {
      editor.setJSON(newVal);
    } else {
      editor.setHtml(String(newVal));
    }
  }
});

const canvasStyle = computed(() => {
  if (props.minHeight) {
    const minH = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
    return { '--feather-canvas-min-height': minH };
  }
  if (selectedPaper.value === 'a4') {
    return { '--feather-canvas-min-height': props.landscape ? '700px' : '1020px' };
  }
  if (selectedPaper.value === 'letter') {
    return { '--feather-canvas-min-height': props.landscape ? '720px' : '950px' };
  }
  return {};
});

const paperClasses = computed(() => {
  const p = selectedPaper.value;
  if (!p) return '';
  return `feather-paper-sheet feather-paper--${p} ${props.landscape ? 'feather-paper--landscape' : ''}`.trim();
});

defineExpose({
  getEditor: () => editor,
  getHtml: () => editor?.getHtml() || '',
  setHtml: (html) => editor?.setHtml(html),
  getMarkdown: () => editor?.getMarkdown() || '',
  setMarkdown: (md) => editor?.setMarkdown(md),
  getText: () => editor?.getText() || '',
  getJSON: () => editor?.getJSON() || null,
  cmd: (name, ...args) => editor?.cmd(name, ...args),
  focus: () => editor?.focus(),
});
</script>
