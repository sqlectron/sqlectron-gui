import React, { MutableRefObject } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface QueryEditorProps {}

export const QueryEditor = React.forwardRef<
  monaco.editor.IStandaloneCodeEditor,
  QueryEditorProps
>((props, editorRef) => {
  const getEditor = () =>
    editorRef as MutableRefObject<monaco.editor.IStandaloneCodeEditor>;

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Make editor accessible by parent components.
    // It is done through ref so it causes less rendering to access its value.
    getEditor().current = editor;

    editor.focus();

    interface resizeDaveEvent {
      width: number;
      height: number;
      source: 'horizontal-resize' | 'vertical-resize';
    }

    // Handle resizing of the editor based on the split panels and the window resizing.
    // The bult-in editor option "automaticLayout" doesn't work properly with our layout.
    window.addEventListener('queryEditorResize', ((event: CustomEvent) => {
      const data = event.detail as resizeDaveEvent;
      editor.layout({
        width: data.width,
        height:
          data.source === 'horizontal-resize'
            ? editor.getContentHeight()
            : data.height,
      });
    }) as EventListener);
  };

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: false,
  };

  return (
    <MonacoEditor
      language='sql'
      theme='vs-dark'
      options={options}
      editorDidMount={editorDidMount}
    />
  );
});
