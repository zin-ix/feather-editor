import { createFromConfig } from './createFromConfig.js';
import defaultConfig from '../feather.config.js';
import { icons } from './ui/icons.js';

export const DEFAULT_BOILERPLATE_CONTENT = `
<h1>Welcome to Feather Editor</h1>
<p>Feather is an ultralight, zero-dependency rich text editor crafted with modern Feather SVG icons.</p>

<div class="feather-callout feather-callout--yellow" data-type="callout">
  <span class="feather-callout-icon" contenteditable="false" role="button" tabindex="0" aria-label="Change callout icon">${icons.lightbulb}</span>
  <div class="feather-callout-body">
    <strong>Pro Tip:</strong> Press <kbd>/</kbd> anywhere on a new line to open the slash command palette, or select text to reveal the floating bubble menu.
  </div>
</div>

<h2>Features</h2>
<ul class="feather-task-list" data-type="task-list">
  <li class="feather-task-item" data-checked="true"><span class="feather-task-checkbox" contenteditable="false" role="checkbox" aria-checked="true">☑</span><span class="feather-task-content"><strong>Zero runtime dependencies</strong> — ultra fast and lightweight</span></li>
  <li class="feather-task-item" data-checked="true"><span class="feather-task-checkbox" contenteditable="false" role="checkbox" aria-checked="true">☑</span><span class="feather-task-content"><strong>Clean Feather SVG icons</strong> — crisp on every display</span></li>
  <li class="feather-task-item" data-checked="false"><span class="feather-task-checkbox" contenteditable="false" role="checkbox" aria-checked="false">☐</span><span class="feather-task-content"><strong>Full formatting suite</strong> — tables, code blocks, task lists, and callouts</span></li>
</ul>

<h2>Code Example</h2>
<pre><code>// Quick start
import { createFullEditor } from 'feather-editor';
import 'feather-editor/styles';

const editor = createFullEditor('#editor');</code></pre>

<h2>Interactive Table</h2>
<table class="feather-table">
  <thead>
    <tr><th>Feature</th><th>Feather Editor</th><th>Traditional RTEs</th></tr>
  </thead>
  <tbody>
    <tr><td>Bundle Size</td><td>Ultra light (<30KB)</td><td>Heavy (>300KB)</td></tr>
    <tr><td>Dependencies</td><td>0 runtime dependencies</td><td>10+ packages</td></tr>
    <tr><td>Icons</td><td>Built-in Feather SVG</td><td>External font/bloat</td></tr>
  </tbody>
</table>

<p></p>
`.trim();

/**
 * Creates a fully configured Feather Editor with all extensions,
 * full toolbar, slash menu, bubble menu, and optional starter boilerplate.
 *
 * @param {string | Element} target - Container element or CSS selector.
 * @param {object} [options={}] - Editor options overrides.
 * @returns {import('./core/Editor.js').Editor}
 */
export function createFullEditor(target, options = {}) {
  const mergedConfig = {
    ...defaultConfig,
    ...options.config,
    editor: {
      content: DEFAULT_BOILERPLATE_CONTENT,
      ...defaultConfig.editor,
      ...options,
    },
  };

  return createFromConfig(target, mergedConfig);
}
