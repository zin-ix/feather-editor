/**
 * Feather Editor for Vue 3
 *
 * A lightweight, zero-dependency rich text editor for Vue 3 with clean Feather icons.
 * Headless by design, paper-canvas ready.
 *
 * Quick start:
 *
 *   import { FeatherEditor, StarterKit } from 'feather-editor-vue';
 *   import 'feather-editor-vue/styles';
 */

import { Editor } from './core/Editor.js';
import { FeatherEditor, useFeather } from '../adapters/vue/index.js';

export { Editor };
export { FeatherEditor, useFeather };
export default FeatherEditor;

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
