import React, { MutableRefObject } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Box } from '@chakra-ui/react';

export interface QueryEditorProps {}

export const QueryEditor = React.forwardRef<
  monaco.editor.IStandaloneCodeEditor,
  QueryEditorProps
>((props, editorRef) => {
  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Make editor accessible by parent components.
    // It is done through ref so it causes less rendering to access its value.
    (editorRef as MutableRefObject<
      monaco.editor.IStandaloneCodeEditor
    >).current = editor;

    editor.focus();
  };

  const options = {
    selectOnLineNumbers: true,
    //automaticLayout: true,
  };

  return (
    <Box h='300px'>
      <MonacoEditor
        language='sql'
        theme='vs-dark'
        options={options}
        editorDidMount={editorDidMount}
      />
    </Box>
  );
});
