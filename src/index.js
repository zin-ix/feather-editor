/**
 * Feather Editor
 *
 * A lightweight, zero-dependency rich text editor with clean Feather icons.
 * Framework-agnostic — works with vanilla JS, React, Vue, Svelte, and Web Components.
 *
 * Quick start:
 *
 *   import { createFullEditor } from 'feather-editor';
 *   import 'feather-editor/styles';
 *
 *   const editor = createFullEditor('#my-div');
 */

import { Editor } from './core/Editor.js';

export { Editor };
export { Editor as FeatherEditor };
export { Editor as RuneEditor };

export { createFromConfig }  from './createFromConfig.js';
export { createFullEditor, DEFAULT_BOILERPLATE_CONTENT } from './boilerplate.js';
export { EventBus }    from './core/EventBus.js';
export { History }     from './core/History.js';
export { Schema }      from './core/Schema.js';
export { Selection }   from './core/Selection.js';

// Icons
export { icons } from './ui/icons.js';

// Extensions
export * from './extensions/index.js';

// Utils (useful for building custom extensions)
export * from './utils/dom.js';
export * from './utils/html.js';
export * from './utils/id.js';
export { htmlToMarkdown } from './utils/markdown.js';
export { markdownToHtml } from './utils/markdownToHtml.js';
export { htmlToJson, jsonToHtml } from './utils/json.js';
