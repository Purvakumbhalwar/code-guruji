import React, { useState, useEffect } from 'react';
import { Sun, Moon, History as HistoryIcon, Brain } from 'lucide-react';

// Components
import CodeEditor from './components/CodeEditor';
import ModeSelector from './components/ModeSelector';
import ResultDisplay from './components/ResultDisplay';
import Controls from './components/Controls';
import History from './components/History';
import CompareMode from './components/CompareMode';

// Services
import geminiService from './services/geminiService';
import storageService from './services/storageService';

// Styles
import './App.css';

function App() {
  // Main state
  const [code, setCode] = useState('');
  const [code1, setCode1] = useState(''); // For comparison mode
  const [code2, setCode2] = useState(''); // For comparison mode
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Settings
  const [selectedMode, setSelectedMode] = useState('review');
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [theme, setTheme] = useState('light');
  
  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  // Initialize theme from storage and test API
  useEffect(() => {
    const savedTheme = storageService.getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Test API connection on startup
    const testAPI = async () => {
      try {
        console.log('Testing API connection on startup...');
        await geminiService.testConnection();
        console.log('✅ Gemini API connection successful');
      } catch (error) {
        console.error('❌ Gemini API connection failed:', error);
        setError(`API Connection Error: ${error.message}`);
      }
    };
    
    testAPI();
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storageService.saveTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Copy to clipboard handler
  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  // Main analysis handler
  const handleAnalyze = async () => {
    if (!code.trim() && selectedMode !== 'compare') {
      setError('Please enter some code to analyze');
      return;
    }

    if (selectedMode === 'compare' && (!code1.trim() || !code2.trim())) {
      setError('Please enter both code snippets for comparison');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      let analysisResult;
      
      switch (selectedMode) {
        case 'review':
          analysisResult = await geminiService.codeReview(code, language, difficulty);
          break;
        case 'explain':
          analysisResult = await geminiService.explainCode(code, language, difficulty);
          break;
        case 'bugs':
          analysisResult = await geminiService.findBugs(code, language);
          break;
        case 'lineByLine':
          analysisResult = await geminiService.lineByLineExplanation(code, language, difficulty);
          break;
        case 'compare':
          analysisResult = await geminiService.compareCode(code1, code2, language);
          break;
        case 'refactor':
          analysisResult = await geminiService.refactorCode(code, language, difficulty);
          break;
        default:
          throw new Error('Unknown analysis mode');
      }

      setResult(analysisResult);
      
      // Save to history
      const historyEntry = {
        code: selectedMode === 'compare' ? `${code1}\n\n--- COMPARISON ---\n\n${code2}` : code,
        language,
        mode: selectedMode,
        difficulty,
        result: analysisResult
      };
      storageService.saveToHistory(historyEntry);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  // Load from history handler
  const handleLoadFromHistory = (entry) => {
    if (entry.mode === 'compare') {
      const [snippet1, snippet2] = entry.code.split('\n\n--- COMPARISON ---\n\n');
      setCode1(snippet1 || '');
      setCode2(snippet2 || '');
    } else {
      setCode(entry.code);
    }
    setSelectedMode(entry.mode);
    setLanguage(entry.language);
    setDifficulty(entry.difficulty || 'intermediate');
    setResult(entry.result || '');
  };

  // Clear all data
  const handleClear = () => {
    setCode('');
    setCode1('');
    setCode2('');
    setResult('');
    setError('');
  };

  // Check if analysis can be performed
  const canAnalyze = selectedMode === 'compare' 
    ? code1.trim() && code2.trim() 
    : code.trim();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Brain className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Code Guruji
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  AI-Powered Code Analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-3">
              <button
                onClick={() => setShowHistory(true)}
                className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="View History"
              >
                <HistoryIcon size={18} className="md:w-5 md:h-5" />
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
              </button>
              
              <button
                onClick={handleClear}
                className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          {/* Mode Selection */}
          <ModeSelector 
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            disabled={loading}
          />

          {/* Controls */}
          <Controls
            language={language}
            onLanguageChange={setLanguage}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onAnalyze={handleAnalyze}
            loading={loading}
            disabled={loading}
            canAnalyze={canAnalyze}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 md:p-4">
              <p className="text-red-700 dark:text-red-300 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Code Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {selectedMode === 'compare' ? 'Code Comparison' : 'Code Input'}
              </h2>
            </div>
            <div className="p-3 md:p-4">
              {selectedMode === 'compare' ? (
                <CompareMode
                  code1={code1}
                  code2={code2}
                  onCode1Change={setCode1}
                  onCode2Change={setCode2}
                  language={language}
                  theme={theme}
                />
              ) : (
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  theme={theme}
                  height={window.innerWidth < 768 ? '250px' : '400px'}
                />
              )}
            </div>
          </div>

          {/* Results */}
          <ResultDisplay
            result={result}
            loading={loading}
            onCopy={handleCopyToClipboard}
            mode={selectedMode}
          />
        </div>
      </main>

      {/* History Modal */}
      <History
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadFromHistory={handleLoadFromHistory}
      />

    </div>
  );
}

export default App;
