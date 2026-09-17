import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFeather, FeatherEditor } from '../../adapters/vue/index.js';
import { Paragraph } from '../../src/extensions/blocks/Paragraph.js';

describe('Vue 3 adapter', () => {
  let node;
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });
  afterEach(() => {
    node.remove();
  });

  it('exports FeatherEditor and useFeather', () => {
    expect(useFeather).toBeDefined();
    expect(FeatherEditor).toBeDefined();
  });

  it('useFeather returns reactive refs and helper functions', () => {
    const api = useFeather({ extensions: [Paragraph], content: '<p>Vue Test</p>' });
    expect(api.el).toBeDefined();
    expect(api.editor).toBeDefined();
    expect(typeof api.getHtml).toBe('function');
    expect(typeof api.setHtml).toBe('function');
    expect(typeof api.cmd).toBe('function');
    expect(typeof api.focus).toBe('function');
  });
});
