import React from 'react';
import { Code, Settings, Play } from 'lucide-react';

const Controls = ({ 
  language, 
  onLanguageChange, 
  difficulty, 
  onDifficultyChange, 
  onAnalyze, 
  loading,
  disabled,
  canAnalyze = true
}) => {
  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js' },
    { value: 'python', label: 'Python', ext: '.py' },
    { value: 'java', label: 'Java', ext: '.java' },
    { value: 'cpp', label: 'C++', ext: '.cpp' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', desc: 'Simple explanations' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Balanced detail' },
    { value: 'expert', label: 'Expert', desc: 'Technical depth' }
  ];

  return (
    <div className="controls bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Language Selection */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Code size={16} className="text-gray-600 dark:text-gray-400 md:w-5 md:h-5" />
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Language
            </label>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={disabled}
            className="block w-full px-2 md:px-3 py-1.5 md:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label} ({lang.ext})
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Settings size={16} className="text-gray-600 dark:text-gray-400 md:w-5 md:h-5" />
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level
            </label>
          </div>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            disabled={disabled}
            className="block w-full px-2 md:px-3 py-1.5 md:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {difficulties.map((diff) => (
              <option key={diff.value} value={diff.value}>
                <span className="hidden md:inline">{diff.label} - {diff.desc}</span>
                <span className="md:hidden">{diff.label}</span>
              </option>
            ))}
          </select>
        </div>

        {/* Analyze Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onAnalyze}
            disabled={loading || disabled || !canAnalyze}
            className="flex items-center justify-center space-x-2 w-full lg:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Play size={16} />
            )}
            <span className="font-medium text-sm md:text-base">
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
