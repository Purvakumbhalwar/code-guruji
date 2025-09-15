import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript',
  theme = 'light',
  placeholder = 'Paste your code here...',
  height = '300px',
  readOnly = false
}) => {
  const getLanguageExtension = () => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return [javascript()];
      case 'python':
      case 'py':
        return [python()];
      case 'java':
        return [java()];
      case 'cpp':
      case 'c++':
        return [cpp()];
      default:
        return [javascript()];
    }
  };

  const extensions = [...getLanguageExtension()];

  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        height={height}
        theme={theme === 'dark' ? oneDark : 'light'}
        extensions={extensions}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false
        }}
      />
    </div>
  );
};

export default CodeEditor;
