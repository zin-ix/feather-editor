// Type definitions for feather-editor-vue
import type { Ref, ShallowRef, DefineComponent } from 'vue';
import type { Editor, EditorOptions, Extension } from './index';

export interface UseFeatherResult {
  /** Bind to the mount element: `<div ref="el" />`. */
  el: Ref<HTMLElement | null>;
  /** The Editor instance (null until mounted). */
  editor: ShallowRef<Editor | null>;
  getHtml(): string;
  setHtml(html: string): void;
  cmd(name: string, ...args: any[]): any;
  focus(): void;
}

export function useFeather(options?: EditorOptions): UseFeatherResult;

export interface FeatherEditorProps {
  modelValue?: string | object;
  content?: string | object;
  placeholder?: string;
  outputFormat?: 'html' | 'markdown' | 'text' | 'json';
  toolbar?: boolean | { items?: string[] };
  bubbleMenu?: boolean | { items?: string[] };
  slashMenu?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  attribution?: boolean;
  minHeight?: string | number;
  class?: string;
  extensions?: Extension[];
}

export const FeatherEditor: DefineComponent<FeatherEditorProps>;
export default FeatherEditor;
