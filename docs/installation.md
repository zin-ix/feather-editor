# Installation & Setup — Vue 3

How to install and configure **Feather Editor** (`feather-editor-vue`) in **Vue 3** applications.

- [Requirements](#requirements)
- [Installation](#installation)
- [Package Exports](#package-exports)
- [Vue 3 Setup](#vue-3-setup)
  - [Component Usage (`FeatherEditor`)](#component-usage-feathereditor)
  - [Composable Usage (`useFeather`)](#composable-usage-usefeather)
  - [Vanilla JS / Standalone](#vanilla-js--standalone)
- [Configuration (`feather.config.js`)](#configuration-featherconfigjs)
- [Paper Formats & Print Styling](#paper-formats--print-styling)
- [Troubleshooting](#troubleshooting)

---

## Requirements

- **Vue 3** (`>= 3.2`)
- **A modern evergreen browser** supporting `contenteditable`
- **Zero external dependencies** for the core editor

---

## Installation

```bash
# npm
npm install feather-editor-vue

# yarn
yarn add feather-editor-vue

# pnpm
pnpm add feather-editor-vue
```

Import the stylesheet in your app entry (e.g. `main.js` or `App.vue`):

```js
import 'feather-editor-vue/styles';
```

---

## Package Exports

| Import Path | Resolves To | Description |
|---|---|---|
| `feather-editor-vue` | `src/index.js` | Vue Component (`FeatherEditor`), Composable (`useFeather`), and all extensions |
| `feather-editor-vue/vue` | `adapters/vue/index.js` | Dedicated Vue 3 Component & Composable subpath |
| `feather-editor-vue/styles` | `styles/feather.css` | Minimalist design system and paper canvas styles |

---

## Vue 3 Setup

### Component Usage (`FeatherEditor`)

The easiest way to integrate Feather Editor into a Vue 3 SFC:

```vue
<script setup>
import { ref } from 'vue';
import { FeatherEditor, StarterKit } from 'feather-editor-vue';
import 'feather-editor-vue/styles';

const content = ref('<p>Hello from Feather Editor in Vue 3!</p>');

function handleChange(html) {
  content.value = html;
  console.log('Document updated:', html);
}
</script>

<template>
  <div class="editor-container">
    <FeatherEditor
      :extensions="StarterKit"
      :content="content"
      placeholder="Start typing your document…"
      @change="handleChange"
    />
  </div>
</template>
```

#### Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `extensions` | `Array` | `StarterKit` | Array of block, mark, and plugin extensions |
| `content` | `String` | `''` | Initial HTML content |
| `placeholder`| `String` | `'Start writing…'` | Placeholder shown when editor is empty |
| `toolbar` | `Boolean` | `true` | Show top floating/sticky toolbar |
| `bubbleMenu` | `Boolean` | `true` | Show inline bubble formatting menu on text selection |
| `slashMenu` | `Boolean` | `true` | Show `/` slash command menu |
| `readOnly` | `Boolean` | `false` | Disable editing |
| `attribution`| `Boolean` | `true` | Show subtle "Made with Feather" footer credit |

#### Component Events

| Event | Payload | Description |
|---|---|---|
| `@change` | `html: string` | Emitted on every document content update |

---

### Composable Usage (`useFeather`)

For custom layouts where you manage the mount target and editor actions directly:

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { useFeather, StarterKit } from 'feather-editor-vue';
import 'feather-editor-vue/styles';

const { el, editor, getHtml, setHtml, cmd, focus } = useFeather({
  extensions: StarterKit,
  content: '<h2>Custom Vue 3 Canvas</h2><p>Full control over the editor instance.</p>',
  onChange: (html) => {
    console.log('HTML:', html);
  },
});
</script>

<template>
  <div class="custom-wrapper">
    <!-- Custom toolbar controls -->
    <div class="custom-bar">
      <button @click="cmd('toggleBold')">Bold</button>
      <button @click="cmd('toggleItalic')">Italic</button>
      <button @click="cmd('setHeading', 2)">H2</button>
    </div>

    <!-- Editor mount target -->
    <div ref="el" class="canvas-mount" />
  </div>
</template>
```

---

### Vanilla JS / Standalone

If instantiating directly in pure JS outside a template:

```js
import { createFromConfig } from 'feather-editor-vue';
import config from './feather.config.js';
import 'feather-editor-vue/styles';

const editor = createFromConfig('#app', config, {
  content: '<p>Start writing…</p>',
  onChange(html) { console.log(html); },
});
```

---

## Configuration (`feather.config.js`)

You can customize enabled blocks, marks, formatting options, and plugins using `feather.config.js`:

```js
import config from './feather.config.js';

// Toggle any feature on or off
config.blocks.table = true;
config.blocks.callout = true;
config.plugins.markdownShortcuts = true;
config.plugins.findReplace = true;
```

---

## Paper Formats & Print Styling

Feather Editor includes built-in paper formats for realistic document editing and clean PDF output:

- **Formats**: `A4`, `Letter`, `Legal`, `A5`, and `Fluid` (responsive)
- **Orientation**: `Portrait` / `Landscape`
- **Print**: Standard `editor.print()` or browser `Ctrl+P` formats the active paper layout seamlessly.

---

## Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| **Unstyled toolbar or canvas** | Missing CSS import | Add `import 'feather-editor-vue/styles';` to your entry file or component. |
| **SSR / Hydration mismatch** | Editor accessing DOM during SSR | Ensure the component is mounted on the client (`onMounted` or Client-Only wrapper). |
| **Memory leak on route change** | Editor listeners not cleaned up | `FeatherEditor` and `useFeather` auto-destroy on unmount. If using `new Editor()`, call `editor.destroy()` in `onBeforeUnmount`. |
