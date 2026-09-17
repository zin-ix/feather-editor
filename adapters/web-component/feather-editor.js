/**
 * <feather-editor> — Web Component adapter for Feather Editor.
 *
 * Drop-in usage (no framework required):
 *
 *   <script type="module" src="adapters/web-component/feather-editor.js"></script>
 *   <link rel="stylesheet" href="styles/feather.css">
 *
 *   <feather-editor
 *     content="<p>Hello world</p>"
 *     placeholder="Start writing…"
 *   ></feather-editor>
 */

import { createFromConfig } from '../../src/createFromConfig.js';
import defaultConfig        from '../../feather.config.js';

class FeatherEditorElement extends HTMLElement {
  static get observedAttributes() {
    return ['content', 'placeholder', 'readonly'];
  }

  connectedCallback() {
    if (this._editor) return;

    const config = Object.fromEntries(
      Object.entries(defaultConfig).map(([k, v]) =>
        [k, v && typeof v === 'object' ? { ...v } : v]
      )
    );

    if (this.hasAttribute('placeholder')) {
      config.editor.placeholder = this.getAttribute('placeholder');
    }
    if (this.hasAttribute('readonly')) {
      config.editor.readOnly = true;
    }
    if (this.getAttribute('attribution') === 'false') {
      config.editor.attribution = false;
    }

    const lightDom = this.innerHTML.trim();

    const mount = document.createElement('div');
    this._mount = mount;
    this.appendChild(mount);

    const initialContent =
      this._htmlBeforeDisconnect ??
      (this.getAttribute('content') || lightDom);
    this._htmlBeforeDisconnect = null;

    this._editor = createFromConfig(mount, config, {
      content: initialContent,
      onChange: (html) => {
        this.dispatchEvent(new CustomEvent('change', {
          detail:  html,
          bubbles: true,
          composed: true,
        }));
      },
    });
  }

  disconnectedCallback() {
    if (this._editor) this._htmlBeforeDisconnect = this._editor.getHtml();
    this._editor?.destroy();
    this._editor = null;
    this._mount?.remove();
    this._mount = null;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._editor || oldVal === newVal) return;
    if (name === 'content')     this._editor.setHtml(newVal ?? '');
    if (name === 'readonly')    newVal !== null ? this._editor.disable() : this._editor.enable();
    if (name === 'placeholder') {
      this._editor.content.dataset.placeholder = newVal ?? '';
      this._editor.content.setAttribute('aria-placeholder', newVal ?? '');
    }
  }

  get editor()         { return this._editor; }
  getHtml()            { return this._editor?.getHtml() ?? ''; }
  setHtml(html)        { this._editor?.setHtml(html); }
  getMarkdown()        { return this._editor?.getMarkdown() ?? ''; }
  print()              { this._editor?.print(); }
  cmd(name, ...args)   { return this._editor?.cmd(name, ...args); }
}

if (!customElements.get('feather-editor')) {
  customElements.define('feather-editor', FeatherEditorElement);
}

export { FeatherEditorElement };
