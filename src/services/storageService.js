class StorageService {
  constructor() {
    this.HISTORY_KEY = 'code_guruji_history';
    this.THEME_KEY = 'code_guruji_theme';
  }

  // History Management
  saveToHistory(entry) {
    try {
      const history = this.getHistory();
      const newEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...entry
      };
      
      history.unshift(newEntry);
      
      // Keep only last 50 entries
      const trimmedHistory = history.slice(0, 50);
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmedHistory));
      return newEntry.id;
    } catch (error) {
      console.error('Error saving to history:', error);
      return null;
    }
  }

  getHistory() {
    try {
      const history = localStorage.getItem(this.HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  getHistoryEntry(id) {
    const history = this.getHistory();
    return history.find(entry => entry.id === id);
  }

  deleteHistoryEntry(id) {
    try {
      const history = this.getHistory();
      const updatedHistory = history.filter(entry => entry.id !== id);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Error deleting history entry:', error);
      return false;
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(this.HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }

  // Theme Management
  saveTheme(theme) {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  }

  getTheme() {
    try {
      return localStorage.getItem(this.THEME_KEY) || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'light';
    }
  }

  // Export/Import functionality
  exportHistory() {
    const history = this.getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-guruji-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importHistory(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedHistory = JSON.parse(e.target.result);
          if (Array.isArray(importedHistory)) {
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(importedHistory));
            resolve(importedHistory.length);
          } else {
            reject(new Error('Invalid history file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}

const storageService = new StorageService();
export default storageService;
