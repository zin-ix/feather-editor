<template>
  <div ref="editorRef" :class="['feather-editor-container', 'rune-editor-container', customClass]" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { FeatherEditor as CoreEditor, StarterKit } from 'feather-editor';
import 'feather-editor/styles';

const props = defineProps({
  modelValue: { type: String, default: undefined },
  content: { type: String, default: '' },
  placeholder: { type: String, default: "Write something, or type '/' for commands…" },
  extensions: { type: Array, default: () => StarterKit },
  toolbar: { type: [Boolean, Object], default: true },
  bubbleMenu: { type: [Boolean, Object], default: true },
  slashMenu: { type: Boolean, default: true },
  readOnly: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'change', 'ready']);
const editorRef = ref(null);
let editor = null;

onMounted(() => {
  if (!editorRef.value) return;

  const initialContent = props.modelValue !== undefined ? props.modelValue : props.content;

  editor = new CoreEditor(editorRef.value, {
    content: initialContent,
    placeholder: props.placeholder,
    extensions: props.extensions,
    toolbar: props.toolbar,
    bubbleMenu: props.bubbleMenu,
    slashMenu: props.slashMenu,
    readOnly: props.readOnly,
    onChange(html, inst) {
      emit('update:modelValue', html);
      emit('change', html, inst);
    },
  });

  emit('ready', editor);
});

onBeforeUnmount(() => {
  editor?.destroy();
  editor = null;
});

watch(() => props.readOnly, (val) => {
  if (!editor) return;
  val ? editor.disable() : editor.enable();
});

watch(() => props.modelValue !== undefined ? props.modelValue : props.content, (newVal) => {
  if (!editor || newVal === undefined) return;
  if (newVal !== editor.getHtml()) {
    editor.setHtml(newVal);
  }
});

defineExpose({
  getEditor: () => editor,
  getHtml: () => editor?.getHtml() || '',
  setHtml: (html) => editor?.setHtml(html),
  cmd: (name, ...args) => editor?.cmd(name, ...args),
});
</script>
