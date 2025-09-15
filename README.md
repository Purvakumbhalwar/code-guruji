# Code Guruji - AI-Powered Code Review App

A comprehensive React-based code review application powered by Google's Gemini AI that helps developers improve their code quality through intelligent analysis.

## Features

### Core Features (MVP)
- **Code Editor**: Advanced syntax highlighting for JavaScript, Python, C++, and Java
- **Multiple Analysis Modes**:
  - **Code Review**: Best practices, readability, and performance feedback
  - **Explain Code**: Plain English explanations of code functionality
  - **Bug Finder**: Detect errors and logic flaws
- **AI-Powered Feedback**: Gemini API integration for intelligent analysis
- **Copy to Clipboard**: Easy result sharing

### Learning Features
- **Line-by-Line Explanation**: Detailed breakdown of each code line
- **Difficulty Levels**: Beginner, Intermediate, and Expert explanations
- **Comparison Mode**: Compare two code snippets side by side
- **Refactor Suggestions**: Get cleaner, optimized code versions

### Extra Features
- **History Management**: Save and review past analyses
- **Dark/Light Theme**: Eye-friendly interface options
- **Export/Import**: Backup and restore your analysis history
- **Responsive Design**: Works on all device sizes

## Technologies Used

- **React 18** - Modern UI framework
- **CodeMirror 6** - Advanced code editor with syntax highlighting
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Google Gemini AI** - Advanced AI analysis
- **Local Storage** - Client-side data persistence

## Setup Instructions

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/code-guruji.git
cd code-guruji
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment Variables**

**IMPORTANT**: You need a Gemini API key to run this application.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

3. Edit the `.env` file and replace `your_gemini_api_key_here` with your actual API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. **Start Development Server**
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### 5. **Build for Production**
```bash
npm run build
```

## Usage Guide

1. **Select Analysis Mode**: Choose from Review, Explain, Bug Finder, etc.
2. **Choose Language**: Select your programming language
3. **Set Difficulty**: Pick your experience level
4. **Paste Code**: Enter your code in the editor
5. **Analyze**: Click the analyze button for AI feedback
6. **Review Results**: Get formatted, actionable insights

### Special Modes

- **Comparison Mode**: Paste two code snippets to compare approaches
- **History**: Access previous analyses and reload them
- **Export/Import**: Backup your analysis history

## Project Structure

```
src/
├── components/           # React components
│   ├── CodeEditor.js    # Code input with syntax highlighting
│   ├── ModeSelector.js  # Analysis mode selection
│   ├── ResultDisplay.js # AI feedback display
│   ├── Controls.js      # Language and difficulty controls
│   ├── History.js       # History management
│   └── CompareMode.js   # Code comparison interface
├── services/            # Business logic
│   ├── geminiService.js # AI API integration
│   └── storageService.js# Local storage management
├── App.js              # Main application component
└── App.css             # Styling and animations
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Security & Privacy

### API Key Security
- **Environment Variables**: API keys are stored in environment variables, not in source code
- **Git Ignore**: `.env` file is excluded from version control
- **Local Storage Only**: Your code and analysis history are stored locally in your browser
- **No Server**: This is a client-side application - your code never leaves your device except for API calls to Google's Gemini

### Important Notes
- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- The free tier of Gemini API has usage limits
- Your code snippets are sent to Google's API for analysis

## Key Features in Detail

### AI Analysis Modes
- **Code Review**: Comprehensive feedback on coding standards, performance, and best practices
- **Code Explanation**: Step-by-step breakdown in plain English
- **Bug Detection**: Identify syntax errors, logic flaws, and potential runtime issues
- **Line-by-Line**: Detailed explanation of each code line
- **Comparison**: Side-by-side analysis of two implementations
- **Refactoring**: Suggestions for cleaner, more efficient code

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly interface for extended coding sessions
- **Persistent History**: Save and revisit previous analyses
- **Export/Import**: Backup your work and share with team members






