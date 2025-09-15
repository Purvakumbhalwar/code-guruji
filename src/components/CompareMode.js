import React from 'react';
import CodeEditor from './CodeEditor';
import { ArrowLeftRight } from 'lucide-react';

const CompareMode = ({ 
  code1, 
  code2, 
  onCode1Change, 
  onCode2Change, 
  language, 
  theme 
}) => {
  return (
    <div className="compare-mode">
      <div className="flex items-center justify-center mb-3 md:mb-4">
        <div className="flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 px-3 md:px-4 py-2 rounded-lg">
          <ArrowLeftRight size={16} className="text-orange-500 md:w-5 md:h-5" />
          <span className="font-medium text-sm md:text-base text-orange-700 dark:text-orange-300">
            Comparison Mode
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Snippet 1
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <CodeEditor
              value={code1}
              onChange={onCode1Change}
              language={language}
              theme={theme}
              placeholder="Paste your first code snippet here..."
              height={window.innerWidth < 768 ? '200px' : '300px'}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Snippet 2
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <CodeEditor
              value={code2}
              onChange={onCode2Change}
              language={language}
              theme={theme}
              placeholder="Paste your second code snippet here..."
              height={window.innerWidth < 768 ? '200px' : '300px'}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-3 md:mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">
          <strong>Comparison Analysis:</strong> The AI will compare both code snippets and provide insights on 
          functionality, performance, readability, and best practices to help you choose the better approach.
        </p>
      </div>
    </div>
  );
};

export default CompareMode;
