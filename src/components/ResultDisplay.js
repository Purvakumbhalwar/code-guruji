import React, { useState } from 'react';
import { Copy, Check, Download, Eye } from 'lucide-react';

const ResultDisplay = ({ result, loading = false, onCopy, mode }) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleCopy = async () => {
    if (result && onCopy) {
      await onCopy(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-analysis-${mode}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatResult = (text) => {
    if (!text) return '';
    
    // Convert markdown-like formatting to HTML with better spacing
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
      .replace(/`([^`]+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono text-gray-800 dark:text-gray-200">$1</code></pre>')
      .replace(/^(\d+\.)\s+(.+?)$/gm, '<div class="my-3"><span class="font-semibold text-blue-600 dark:text-blue-400">$1</span> $2</div>')
      .replace(/^[-•]\s+(.+?)$/gm, '<div class="ml-4 my-2 flex items-start"><span class="text-blue-500 mr-2 mt-1">•</span><span>$1</span></div>')
      .replace(/^#{1,3}\s+(.+?)$/gm, '<h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h3>')
      .replace(/\n\n/g, '<div class="my-4"></div>')
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  if (loading) {
    return (
      <div className="result-display">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Analyzing your code...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-display">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Your AI analysis will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-display">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 gap-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
            Analysis Result
          </h3>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={showRaw ? 'Show formatted' : 'Show raw text'}
            >
              <Eye size={16} className="md:w-4 md:h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download result"
            >
              <Download size={16} className="md:w-4 md:h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 md:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="md:w-4 md:h-4" /> : <Copy size={16} className="md:w-4 md:h-4" />}
              <span className="text-xs md:text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {showRaw ? (
            <pre className="whitespace-pre-wrap text-xs md:text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900 p-3 md:p-4 rounded-lg overflow-auto max-h-96 md:max-h-[32rem]">
              {result}
            </pre>
          ) : (
            <div 
              className="formatted-content text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatResult(result) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
