import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Clock, Trash2, Download, Upload } from 'lucide-react';
import storageService from '../services/storageService';

const History = ({ onLoadFromHistory, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const historyData = storageService.getHistory();
    setHistory(historyData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      storageService.deleteHistoryEntry(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      storageService.clearHistory();
      setHistory([]);
    }
  };

  const handleExport = () => {
    storageService.exportHistory();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      storageService.importHistory(file)
        .then((count) => {
          alert(`Successfully imported ${count} history entries`);
          loadHistory();
        })
        .catch((error) => {
          alert('Error importing history: ' + error.message);
        });
    }
  };

  const filteredHistory = history.filter(entry =>
    entry.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'explain': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'bugs': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'lineByLine': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'compare': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'refactor': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <HistoryIcon size={24} className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Analysis History
            </h2>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
              {history.length} entries
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Export history"
            >
              <Download size={18} />
            </button>
            <label className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              title="Import history">
              <Upload size={18} />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className="px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between space-x-4">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-auto p-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <HistoryIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No matching history entries found' : 'No history entries yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(entry.mode)}`}>
                          {entry.mode}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.language}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="mr-1" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded border p-3 mb-2">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden">
                          {entry.code.substring(0, 200)}{entry.code.length > 200 ? '...' : ''}
                        </pre>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          onLoadFromHistory(entry);
                          onClose();
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
