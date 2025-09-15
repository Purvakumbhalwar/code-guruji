import React from 'react';
import { Search, MessageCircle, Bug, FileText, GitCompare, Wand2 } from 'lucide-react';

const ModeSelector = ({ selectedMode, onModeChange, disabled = false }) => {
  const modes = [
    {
      id: 'review',
      name: 'Code Review',
      description: 'Get feedback on best practices, readability, and performance',
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      id: 'explain',
      name: 'Explain Code',
      description: 'Plain English explanation of what the code does',
      icon: MessageCircle,
      color: 'bg-green-500'
    },
    {
      id: 'bugs',
      name: 'Bug Finder',
      description: 'Detect possible errors and logic flaws',
      icon: Bug,
      color: 'bg-red-500'
    },
    {
      id: 'lineByLine',
      name: 'Line-by-Line',
      description: 'Detailed explanation of each line',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      id: 'compare',
      name: 'Compare Code',
      description: 'Compare two code snippets',
      icon: GitCompare,
      color: 'bg-orange-500'
    },
    {
      id: 'refactor',
      name: 'Refactor',
      description: 'Rewrite code in cleaner format',
      icon: Wand2,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="mode-selector">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
        Choose Analysis Mode
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <div
              key={mode.id}
              className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedMode === mode.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onModeChange(mode.id)}
            >
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className={`p-1.5 md:p-2 rounded-md ${mode.color} text-white flex-shrink-0`}>
                  <IconComponent size={16} className="md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
                    {mode.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {mode.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
