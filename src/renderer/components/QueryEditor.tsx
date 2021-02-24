import React, { MutableRefObject } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useDebouncedCallback } from 'use-debounce';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface QueryEditorProps {
  tabId: string;
  onChange: (content: string) => void;
  value: string;
}

declare global {
  interface Window {
    completionItemProvider: monaco.IDisposable;
  }
}

export const QueryEditor = React.forwardRef<
  monaco.editor.IStandaloneCodeEditor,
  QueryEditorProps
>((props, editorRef) => {
  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value: string) => {
      props.onChange(value);
    },
    // delay in ms
    1000,
  );

  const getEditor = () =>
    editorRef as MutableRefObject<monaco.editor.IStandaloneCodeEditor>;

  const editorWillMount = (monaco: any) => {
    // Register SQL suggestions based on:
    // https://github.com/microsoft/monaco-languages/blob/master/src/sql/sql.ts
    const lang = monaco.languages
      .getLanguages()
      .find(({ id }: { id: string }) => id === 'sql')
      .loader();

    lang.then((res: any) => {
      if (window.completionItemProvider) {
        window.completionItemProvider.dispose();
      }

      window.completionItemProvider = monaco.languages.registerCompletionItemProvider(
        'sql',
        {
          provideCompletionItems: function (model: any, position: any) {
            // NOTE: The suggestions won't work after the first
            // used suggestion if the suggestions object isn't re-created.
            // That is why it is defined inside the provideCompletionItems
            // instead of re-using a pre initialized variable.
            const suggestions = res.language.keywords.map(
              (keyword: string) => ({
                label: keyword,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: keyword,
              }),
            );

            return {
              suggestions,
            };
          },
        },
      );
    });
  };

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Make editor accessible by parent components.
    // It is done through ref so it causes less rendering to access its value.
    getEditor().current = editor;

    editor.focus();

    interface resizedEvent {
      selectedTabId: string;
      width: number;
      height: number;
      source: 'horizontal-resize' | 'vertical-resize';
    }

    // Handle resizing of the editor based on the split panels and the window resizing.
    // The bult-in editor option "automaticLayout" doesn't work properly with our layout.
    window.addEventListener('queryEditorResize', ((event: CustomEvent) => {
      const data = event.detail as resizedEvent;
      if (
        data.source === 'vertical-resize' &&
        data.selectedTabId !== props.tabId
      ) {
        console.log('SKIP1 queryEditorResize data', props.tabId, data);
        return;
      }

      if (!data.width) {
        console.log('SKIP2 queryEditorResize data', props.tabId, data);
        editor.layout();
        return;
      }

      console.log('UPDATE queryEditorResize data', props.tabId, data);
      editor.layout({
        width: data.width,
        height:
          data.source === 'horizontal-resize'
            ? editor.getContentHeight()
            : data.height,
      });

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
    //quickSuggestions: true,
  };

  return (
    <MonacoEditor
      language='sql'
      theme='vs-dark'
      options={options}
      editorWillMount={editorWillMount}
      editorDidMount={editorDidMount}
      value={props.value}
      onChange={(value) => debounced.callback(value)}
    />
  );
});
