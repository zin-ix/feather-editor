<script setup>
import { ref, computed } from 'vue';
import FeatherEditor from '../adapters/vue/FeatherEditor.vue';
import { DEFAULT_BOILERPLATE_CONTENT } from './boilerplate.js';
import { htmlToMarkdown } from './utils/markdown.js';

const content = ref(DEFAULT_BOILERPLATE_CONTENT);
const editorRef = ref(null);
const isDark = ref(false);
const showCodePanel = ref(false);
const toastMessage = ref('');
const showToast = ref(false);

// Paper size and layout options
const paperSize = ref('a4'); // 'a4' | 'letter' | 'legal' | 'a5' | 'fluid'
const isLandscape = ref(false);

const paperOptions = [
  { id: 'a4', name: 'A4', desc: '210 × 297 mm' },
  { id: 'letter', name: 'Letter', desc: '8.5 × 11 in' },
  { id: 'legal', name: 'Legal', desc: '8.5 × 14 in' },
  { id: 'a5', name: 'A5', desc: '148 × 210 mm' },
  { id: 'fluid', name: 'Fluid Canvas', desc: 'Continuous' },
];

function triggerToast(msg) {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 1800);
}

const stats = computed(() => {
  const tmp = document.createElement('div');
  tmp.innerHTML = content.value;
  const text = (tmp.textContent || tmp.innerText || '').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  const readTime = Math.ceil(words / 200) || 1;
  return { words, chars, readTime: words ? readTime : 0 };
});

async function copyMarkdown() {
  const md = htmlToMarkdown(content.value);
  await navigator.clipboard.writeText(md);
  triggerToast('Markdown copied to clipboard');
}

async function copyHtml() {
  await navigator.clipboard.writeText(content.value);
  triggerToast('HTML copied to clipboard');
}

function printDocument() {
  window.print();
}

function resetContent() {
  content.value = DEFAULT_BOILERPLATE_CONTENT;
  triggerToast('Content reset');
}

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
</script>

<template>
  <div class="app-layout">
    <!-- Top Minimalist Utility & Paper Control Bar -->
    <header class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <a href="#" class="brand">
            <div class="brand-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <span class="brand-title">feather</span>
          </a>

          <!-- Paper Size Dropdown -->
          <div class="paper-selector-wrap">
            <label class="paper-selector-label">Paper:</label>
            <select v-model="paperSize" class="paper-select">
              <option v-for="p in paperOptions" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.desc }})
              </option>
            </select>
          </div>

          <!-- Orientation Toggle -->
          <button
            v-if="paperSize !== 'fluid'"
            class="btn-ghost"
            :class="{ active: isLandscape }"
            @click="isLandscape = !isLandscape"
            :title="isLandscape ? 'Switch to Portrait' : 'Switch to Landscape'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" v-if="isLandscape" />
              <rect x="5" y="2" width="14" height="20" rx="2" v-else />
            </svg>
            <span>{{ isLandscape ? 'Landscape' : 'Portrait' }}</span>
          </button>
        </div>

        <div class="nav-actions">
          <button
            class="btn-ghost"
            :class="{ active: showCodePanel }"
            @click="showCodePanel = !showCodePanel"
            title="Vue 3 Component Usage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>Vue 3</span>
          </button>

          <button class="btn-ghost" @click="printDocument" title="Print / PDF Export">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print</span>
          </button>

          <button class="btn-ghost" @click="copyMarkdown" title="Copy Markdown">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Markdown</span>
          </button>

          <button class="btn-ghost" @click="copyHtml" title="Copy HTML">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>HTML</span>
          </button>

          <button class="btn-ghost" @click="resetContent" title="Reset content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            <span>Reset</span>
          </button>

          <button class="btn-ghost" @click="toggleTheme" title="Toggle dark/light mode">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Vue 3 Quick Snippet Panel (Collapsible) -->
    <div v-if="showCodePanel" class="panel-view-wrap">
      <div class="panel-view">
        <div class="panel-header">
          <span class="panel-title">Vue 3 Drop-in Component</span>
          <button class="btn-ghost" style="padding: 0.2rem 0.4rem;" @click="showCodePanel = false">✕</button>
        </div>
        <pre class="code-block"><code>&lt;script setup&gt;
import { ref } from 'vue';
import FeatherEditor from 'feather-editor/vue';
import 'feather-editor/styles';

const content = ref('&lt;p&gt;Start writing...&lt;/p&gt;');
&lt;/script&gt;

&lt;template&gt;
  &lt;FeatherEditor v-model="content" /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </div>

    <!-- Paper Canvas Workbench -->
    <main class="feather-paper-workbench">
      <div
        class="feather-paper-sheet"
        :class="[
          `feather-paper--${paperSize}`,
          { 'feather-paper--landscape': isLandscape && paperSize !== 'fluid' }
        ]"
      >
        <FeatherEditor
          ref="editorRef"
          v-model="content"
          placeholder="Write something, or type '/' for commands…"
          :show-toolbar="true"
          :show-slash-menu="true"
          :show-bubble-menu="true"
        />
      </div>
    </main>

    <!-- Minimalist Stats Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="stats">
          <span><strong class="stat-val">{{ stats.words }}</strong> words</span>
          <span><strong class="stat-val">{{ stats.chars }}</strong> characters</span>
          <span><strong class="stat-val">{{ stats.readTime }}</strong> min read</span>
        </div>
        <div class="footer-hint">
          <span>Paper: {{ paperSize.toUpperCase() }} {{ isLandscape ? '(Landscape)' : '' }} | Slash commands <kbd>/</kbd></span>
        </div>
      </div>
    </footer>

    <!-- Minimalist Toast Notification -->
    <div class="toast" :class="{ show: showToast }">{{ toastMessage }}</div>
  </div>
</template>

<style>
:root {
  --bg: #ffffff;
  --fg: #09090b;
  --muted: #71717a;
  --border: #e4e4e7;
  --border-subtle: #e4e4e7;
  --surface: #fafafa;
  --hover: #f4f4f5;
}

[data-theme="dark"] {
  --bg: #09090b;
  --fg: #f4f4f5;
  --muted: #a1a1aa;
  --border: #18181b;
  --border-subtle: #27272a;
  --surface: #121215;
  --hover: #1c1c20;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top Bar */
.app-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--fg);
}

.brand-icon {
  display: flex;
  align-items: center;
  color: var(--fg);
}

.brand-icon svg {
  width: 17px;
  height: 17px;
}

.brand-title {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.paper-selector-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.paper-selector-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
}

.paper-select {
  background: var(--surface);
  color: var(--fg);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: inherit;
  padding: 0.25rem 0.5rem;
  outline: none;
  cursor: pointer;
  transition: border-color 100ms;
}

.paper-select:focus {
  border-color: var(--fg);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-ghost {
  background: transparent;
  border: 1px solid transparent;
  color: var(--muted);
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  font-family: inherit;
  font-weight: 400;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.12s ease;
}

.btn-ghost:hover {
  color: var(--fg);
  background: var(--hover);
}

.btn-ghost svg {
  width: 13px;
  height: 13px;
}

.btn-ghost.active {
  color: var(--fg);
  background: var(--hover);
  border-color: var(--border);
}

/* Panel view */
.panel-view-wrap {
  max-width: 860px;
  margin: 1.5rem auto 0;
  width: 100%;
  padding: 0 1.5rem;
}

.panel-view {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.25rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.panel-title {
  font-size: 0.8rem;
  font-weight: 600;
}

pre.code-block {
  background: var(--bg);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--fg);
  overflow-x: auto;
}

/* Footer */
.app-footer {
  background: #ffffff;
  border-top: 1px solid var(--border);
  padding: 0.45rem 1.25rem;
  font-size: 0.75rem;
  color: var(--muted);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats {
  display: flex;
  gap: 1rem;
}

.stat-val {
  color: var(--fg);
  font-weight: 600;
}

.footer-hint kbd {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--fg);
  color: var(--bg);
  padding: 0.5rem 0.85rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 100;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
