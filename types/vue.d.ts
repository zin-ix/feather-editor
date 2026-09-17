// Type definitions for feather-editor/vue
import type { Ref, ShallowRef, DefineComponent } from 'vue';
import type { Editor, EditorOptions } from './index';

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

export type UseRuneResult = UseFeatherResult;

export function useFeather(options?: EditorOptions): UseFeatherResult;
export function useRune(options?: EditorOptions): UseRuneResult;

export interface FeatherEditorProps extends Partial<EditorOptions> {
  class?: string;
  readOnly?: boolean;
}

export type RuneEditorProps = FeatherEditorProps;

export const FeatherEditor: DefineComponent<FeatherEditorProps>;
export const RuneEditor: DefineComponent<RuneEditorProps>;
export default FeatherEditor;
