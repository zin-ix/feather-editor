<div align="center">

# 🪶 Feather Editor

**The most lightweight rich text editor for Vue 3 — zero dependencies, headless, modular, and fast.**

[![npm version](https://img.shields.io/npm/v/feather-editor-vue?style=flat-square&color=18181b&label=npm)](https://www.npmjs.com/package/feather-editor-vue)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-zero-blue?style=flat-square)](package.json)

[**Getting Started**](#-installation) · [**Vue 3 Integration**](#-vue-3-quick-start) · [**API Docs**](#-api) · [**Configuration**](#%EF%B8%8F-configuration) · [**Installation Guide**](./docs/installation.md)

</div>

---

## ✦ Why Feather Editor?

Most rich text editors are either too heavy (ProseMirror, Slate) or too opinionated (Quill). **Feather Editor** is the most lightweight rich text editor for Vue 3 — a **zero-dependency**, headless WYSIWYG editor that provides absolute control without the bloat.

- 🪶 **Ultra-Lightweight** — zero runtime dependencies, pure vanilla JS core, minimal bundle footprint
- 💚 **Dedicated Vue 3 Support** — direct root import of `FeatherEditor` component and `useFeather` composable
- 🎛 **Config-Driven** — enable/disable every block, mark, and plugin from a single `feather.config.js`
- 🎨 **Headless by Design** — 100% styled via CSS custom properties (`styles/feather.css`)
- 🔌 **Extensible Architecture** — add custom blocks, marks, and plugins with plain JavaScript objects
- 📄 **Paper Sizing & Print-Ready** — built-in A4, Letter, Legal, A5, and fluid canvas formats with clean PDF printing
- 🔒 **Security-First** — sanitized paste, blocked `javascript:` URLs, safe HTML output

---

## 📦 Installation

```bash
# npm
npm install feather-editor-vue

# yarn
yarn add feather-editor-vue

# pnpm
pnpm add feather-editor-vue
```

Import the stylesheet once in your app entry point (e.g. `main.js`):

```js
import 'feather-editor-vue/styles';
```

---

## ⚡ Vue 3 Quick Start

### Component (`FeatherEditor`)

```vue
<script setup>
import { ref } from 'vue';
import { FeatherEditor, StarterKit } from 'feather-editor-vue';
import 'feather-editor-vue/styles';

const content = ref('<p>Hello from Feather Editor in Vue 3!</p>');

function handleChange(html) {
  content.value = html;
}
</script>

<template>
  <FeatherEditor
    :extensions="StarterKit"
    :content="content"
    placeholder="Start typing your document…"
    @change="handleChange"
  />
</template>
```

### Composable (`useFeather`)

```vue
<script setup>
import { useFeather, StarterKit } from 'feather-editor-vue';
import 'feather-editor-vue/styles';

const { el, editor, getHtml, setHtml, cmd, focus } = useFeather({
  extensions: StarterKit,
  content: '<p>Custom canvas layout</p>',
  onChange: (html) => console.log(html),
});
</script>

<template>
  <div class="custom-editor-layout">
    <div class="toolbar">
      <button @click="cmd('toggleBold')">Bold</button>
      <button @click="cmd('toggleItalic')">Italic</button>
      <button @click="cmd('setHeading', 2)">H2</button>
    </div>
    <div ref="el" class="editor-mount" />
  </div>
</template>
```

### Vanilla JS (if needed)

```js
import { createFromConfig } from 'feather-editor';
import config from './feather.config.js';
import 'feather-editor/styles';

const editor = createFromConfig('#app', config, {
  content: '<p>Start writing…</p>',
  onChange(html) { console.log(html); },
});
```

---

## ✨ Features

### 🧱 Block Types

| Block | Tag | Slash Command |
|---|---|---|
| Paragraph | `<p>` | — |
| Heading | `<h1>` – `<h3>` | `/h1` `/h2` `/h3` |
| Bullet List | `<ul>` | `/bullet` |
| Ordered List | `<ol>` | `/ordered` |
| Blockquote | `<blockquote>` | `/quote` |
| Code Block | `<pre><code>` | `/code` |
| Horizontal Rule | `<hr>` | `/divider` |
| Callout | custom `<div>` | `/callout` |
| Task List | `<ul data-type>` | `/task` |
| Video Embed | `<figure>` iframe | `/video` |
| Image | `<figure><img>` | `/image` |
| Table | `<table>` | `/table` |

### ✍️ Inline Marks

`Bold` · `Italic` · `Underline` · `Strikethrough` · `Inline Code` · `Link` · `Superscript` · `Subscript` · `Font Size` · `Font Family` · `Text Color` · `Text Background` · `Highlight`

### 🎛 Formatting

`Text Alignment` · `Line Height` · `Indent` · `Outdent` · `Clear Format`

### 🔌 Plugins

| Plugin | Trigger | Description |
|---|---|---|
| Markdown Shortcuts | `# ` `> ` `- ` etc. | Converts Markdown syntax on the fly |
| Find & Replace | `⌘F` / `Ctrl+F` | Floating panel with regex and case match |
| Drag to Reorder | Drag handle `⠿` | Reorder any block smoothly by dragging |
| Format Painter | Toolbar `🖌` | Copy & paste formatting between selections |
| Emoji & Icons | Toolbar `🙂` · `:shortcode:` | Insert emojis inline at the caret or block callouts |

### 📤 Export & Import

```js
editor.getHtml()          // → sanitized HTML string
editor.setHtml('<p>…</p>')// ← replace content from HTML
editor.getText()          // → plain text string
editor.getMarkdown()      // → Markdown string
editor.setMarkdown(md)    // ← replace content from Markdown
editor.insertMarkdown(md) // ← insert Markdown at caret
editor.getJSON()          // → portable JSON document
editor.setJSON(doc)       // ← replace content from JSON
editor.print()            // → opens clean print dialog (paper formats supported)
```

---

## ⚙️ Configuration

All features are toggled from `feather.config.js`. A change here automatically updates the toolbar, bubble menu, slash menu, and keyboard shortcuts — no other files need editing.

```js
// feather.config.js
const config = {

  blocks: {
    paragraph:      true,
    heading:        true,   // H1–H3
    bulletList:     true,
    orderedList:    true,
    blockquote:     true,
    codeBlock:      true,
    horizontalRule: true,
    callout:        true,
    taskList:       true,
    videoEmbed:     true,
    image:          true,
    table:          true,
  },

  marks: {
    bold:           true,   // ⌘B
    italic:         true,   // ⌘I
    underline:      true,   // ⌘U
    strike:         true,   // ⌘⇧S
    code:           true,   // ⌘E
    link:           true,   // ⌘K
    superscript:    true,
    subscript:      true,
    fontSize:       true,
    fontFamily:     true,
    textColor:      true,
    textBackground: true,
    highlight:      true,
  },

  formatting: {
    textAlign:      true,
    lineHeight:     true,
    indent:         true,
    outdent:        true,
    clearFormat:    true,
  },

  plugins: {
    markdownShortcuts: true,
    findReplace:       true,
    dragReorder:       true,
    formatPainter:     true,
    emoji:             true,
  },

  toolbar: {
    enabled: true,
    items: [
      'bold', 'italic', 'underline', 'strike', '|',
      'heading', 'bulletList', 'orderedList', '|',
      'link', 'image', 'table', 'emoji', '|',
      'clearFormat', 'formatPainter',
    ],
  },

  bubbleMenu: {
    enabled: true,
    items: ['bold', 'italic', 'underline', 'strike', '|', 'link'],
  },

  editor: {
    placeholder: "Write something, or type '/' for commands…",
    spellcheck:  true,
    autofocus:   false,
    readOnly:    false,
    attribution: true,   // "Made with Feather" credit; set false to remove
  },

  history: {
    enabled:  true,
    maxSteps: 100,
  },
};

export default config;
```

---

## 📖 API

### Content & Inspection

```js
editor.getHtml()            // → HTML string
editor.setHtml('<p>…</p>') // set content
editor.getText()            // → plain text
editor.getMarkdown()        // → Markdown string
editor.isEmpty()            // → boolean
```

### Commands

```js
editor.cmd('toggleBold')
editor.cmd('setTextColor', '#ef4444')
editor.cmd('insertBlock', 'callout')

// Chainable API
editor.chain().toggleBold().toggleItalic().run()
```

### State & Lifecycle

```js
editor.focus()
editor.blur()
editor.enable()
editor.disable()
editor.isActive('bold')    // → boolean
editor.destroy()
```

### Events

```js
editor.events.on('change',          ({ html }) => { … })
editor.events.on('selectionchange', ({ editor }) => { … })
editor.events.on('keydown',         ({ event }) => { … })
editor.events.on('paste',           ({ editor }) => { … })
```

---

## ⌨️ Keyboard Shortcuts

| Mac | Windows / Linux | Action |
|---|---|---|
| `⌘B` | `Ctrl+B` | Bold |
| `⌘I` | `Ctrl+I` | Italic |
| `⌘U` | `Ctrl+U` | Underline |
| `⌘⇧S` | `Ctrl+Shift+S` | Strikethrough |
| `⌘E` | `Ctrl+E` | Inline code |
| `⌘K` | `Ctrl+K` | Insert / edit link |
| `⌘Z` | `Ctrl+Z` | Undo |
| `⌘⇧Z` | `Ctrl+Shift+Z` | Redo |
| `⌘F` | `Ctrl+F` | Find & Replace |
| `/` | `/` | Slash command menu |

---

## 📝 Markdown Shortcuts

Type at the start of a line followed by `Space`:

| Input | Result |
|---|---|
| `# ` | Heading 1 |
| `## ` | Heading 2 |
| `### ` | Heading 3 |
| `- ` or `* ` | Bullet list |
| `1. ` | Ordered list |
| `> ` | Blockquote |
| ` ``` ` | Code block |
| `---` | Horizontal rule |

Inline marks (wrap text):

| Input | Result |
|---|---|
| `**text**` | **Bold** |
| `*text*` | *Italic* |
| `` `code` `` | `Code` |
| `~~text~~` | ~~Strikethrough~~ |

---

## 🎨 Theming

All colours, sizes, and typography are CSS custom properties defined in `styles/feather.css`. Override them on `:root`:

```css
:root {
  --feather-bg:                 #ffffff;
  --feather-fg:                 #09090b;
  --feather-border:             #e4e4e7;
  --feather-primary:            #18181b;
  --feather-muted:              #f4f4f5;
  --feather-muted-fg:           #71717a;
  --feather-accent:             #f4f4f5;
  --feather-radius:             6px;
  --feather-font-family:        'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --feather-font-mono:          'JetBrains Mono', ui-monospace, monospace;
}
```

**Dark mode** — add `data-theme="dark"` to `<html>` or any ancestor container:

```js
document.documentElement.dataset.theme = 'dark';
```

---

## 🔌 Writing Extensions

Extensions can declare a manifest for ordering and validation: `dependsOn`, `conflictsWith`, `version`, and `lazy: () => import('…')`. Register at runtime with `editor.use(ext)`.

```js
export const MyExt = {
  name: 'myExt', type: 'plugin', version: '1.0.0',
  dependsOn: ['link'], conflictsWith: ['otherExt'],
  commands(editor) { return { /* … */ }; },
};
editor.use(MyExt);
```

---

## 🗂 Project Structure

```
feather-editor/
├── src/
│   ├── core/                  ← Editor, Schema, Commands, EventBus, History, Selection
│   ├── extensions/            ← blocks, marks, formatting, plugins
│   ├── ui/                    ← Toolbar, BubbleMenu, SlashMenu, PresenceBar
│   ├── utils/                 ← dom, html (sanitizer), markdown, json
│   └── createFromConfig.js    ← factory for feather.config.js
├── adapters/
│   └── vue/                   ← useFeather composable + FeatherEditor component
├── docs/                      ← guides and documentation
├── styles/
│   └── feather.css            ← core theme and paper canvas styles
├── feather.config.js          ← feature flags and configuration
└── package.json
```

---

## 🔒 Security

Security is foundational to Feather Editor. Read our [Security Policy](SECURITY.md) for details on HTML sanitization, URL validation, and reporting vulnerabilities.

---

## 📄 License

[MIT](LICENSE) © [Feather](https://feathereditor.dev)

Feather Editor is free and MIT-licensed — use it anywhere, commercially too. By default, the editor displays a subtle **“Made with Feather”** credit; you can remove it anytime with `attribution: false` in `feather.config.js`.
