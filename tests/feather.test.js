import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { FeatherEditor, useFeather, Editor, icons, StarterKit, createFullEditor, DEFAULT_BOILERPLATE_CONTENT } from '../src/index.js';

describe('Feather Editor core & icons', () => {
  let target, editor;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.appendChild(target);
  });

  afterEach(() => {
    editor?.destroy();
    target.remove();
  });

  it('exports Vue component FeatherEditor, useFeather and core Editor', () => {
    expect(Editor).toBeDefined();
    expect(FeatherEditor).toBeDefined();
    expect(useFeather).toBeDefined();
  });

  it('initializes Editor instance successfully', () => {
    editor = new Editor(target, {
      extensions: StarterKit,
      content: '<p>Hello Feather Editor!</p>',
    });
    expect(editor.getHtml()).toBe('<p>Hello Feather Editor!</p>');
  });

  it('createFullEditor mounts full editor with boilerplate content', () => {
    editor = createFullEditor(target);
    expect(editor).toBeInstanceOf(Editor);
    expect(editor.getHtml()).toContain('Welcome to Feather Editor');
    expect(editor.getHtml()).toContain('feather-callout');
  });

  it('exports feather SVG icons with standard attributes', () => {
    expect(icons).toBeDefined();
    expect(typeof icons.bold).toBe('string');
    expect(icons.bold).toContain('<svg viewBox="0 0 24 24"');
    expect(icons.italic).toContain('<svg viewBox="0 0 24 24"');
    expect(icons.callout).toContain('<svg viewBox="0 0 24 24"');
    expect(icons.table).toContain('<svg viewBox="0 0 24 24"');
    expect(icons.codeBlock).toContain('<svg viewBox="0 0 24 24"');
  });

  it('slash menu items use SVG icons instead of emojis', () => {
    editor = new Editor(target, {
      extensions: StarterKit,
      content: '<p></p>',
    });
    const slashItems = editor.schema.getSlashItems();
    expect(slashItems.length).toBeGreaterThan(0);
    slashItems.forEach((item) => {
      expect(item.icon).toContain('<svg');
      // Must not be emoji
      expect(item.icon).not.toBe('💡');
      expect(item.icon).not.toBe('🖼');
      expect(item.icon).not.toBe('☑');
    });
  });

  it('has zero runtime dependencies in package.json', () => {
    const pkgPath = resolve(__dirname, '../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    expect(pkg.dependencies || {}).toEqual({});
  });
});
