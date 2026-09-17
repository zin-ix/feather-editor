<template>
  <div ref="editorRef" :class="['feather-editor-wrapper', customClass]" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { FeatherEditor, StarterKit } from 'feather-editor';
import 'feather-editor/styles';

const props = defineProps({
  content: { type: String, default: '' },
  placeholder: { type: String, default: "Write something, or type '/' for commands…" },
  extensions: { type: Array, default: () => StarterKit },
  toolbar: { type: [Boolean, Object], default: true },
  bubbleMenu: { type: [Boolean, Object], default: true },
  slashMenu: { type: Boolean, default: true },
  readOnly: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
});

const emit = defineEmits(['change', 'ready']);
const editorRef = ref(null);
let editor = null;

onMounted(() => {
  if (!editorRef.value) return;

  editor = new FeatherEditor(editorRef.value, {
    content: props.content,
    placeholder: props.placeholder,
    extensions: props.extensions,
    toolbar: props.toolbar,
    bubbleMenu: props.bubbleMenu,
    slashMenu: props.slashMenu,
    readOnly: props.readOnly,
    onChange(html, inst) {
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

defineExpose({
  getEditor: () => editor,
  getHtml: () => editor?.getHtml() || '',
  setHtml: (html) => editor?.setHtml(html),
});
</script>
