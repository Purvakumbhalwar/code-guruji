import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ REACT_APP_GEMINI_API_KEY is not set in environment variables');
  console.error('Please create a .env file with your Gemini API key');
}

class GeminiService {
  constructor() {
    console.log('Initializing Gemini API...');
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
  }

  async generateContentDirect(prompt, modelName = 'gemini-1.5-flash') {
    try {
      console.log(`Making direct API call to ${modelName}...`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates in response');
      }

      const text = data.candidates[0].content.parts[0].text;
      
      if (!text || text.trim() === '') {
        throw new Error('Empty response text');
      }

      console.log('Direct API call successful');
      return text;
      
    } catch (error) {
      console.error(`Direct API call failed for ${modelName}:`, error);
      throw error;
    }
  }

  async generateContent(prompt) {
    try {
      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      
      if (!result || !result.response) {
        throw new Error('No response from Gemini API');
      }
      
      const response = result.response;
      const text = response.text();
      
      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }
      
      console.log('Successfully received response from Gemini API');
      return text;
      
    } catch (error) {
      console.error('SDK API error, trying direct API call:', error);
      
      // Try direct API call as fallback
      const directModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      
      for (const modelName of directModels) {
        try {
          console.log(`Trying direct API with ${modelName}...`);
          return await this.generateContentDirect(prompt, modelName);
        } catch (directError) {
          console.log(`Direct API failed for ${modelName}:`, directError.message);
          continue;
        }
      }
      
      throw new Error('Both SDK and direct API calls failed');
    }
  }

  async listModels() {
    try {
      console.log('Listing available models...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Available models:', data.models?.map(m => m.name));
      return data.models;
    } catch (error) {
      console.error('Failed to list models:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('Testing Gemini API connection...');
      
      // First, try to list available models
      try {
        await this.listModels();
      } catch (error) {
        console.warn('Could not list models:', error.message);
      }
      
      // Try with direct API call
      const text = await this.generateContentDirect('Say hello and confirm the API is working', 'gemini-1.5-flash');
      console.log('✅ API test successful!');
      console.log('API test response:', text);
      return text;
      
    } catch (error) {
      console.error('API connection test failed:', {
        message: error.message,
        name: error.name,
      });
      throw new Error(`API Connection Failed: ${error.message}`);
    }
  }

  async codeReview(code, language, difficulty = 'intermediate') {
    const prompt = `As a senior software engineer, please review the following ${language} code and provide feedback on:

1. **Best Practices**: Adherence to coding standards and conventions
2. **Readability**: Code clarity and maintainability
3. **Performance**: Efficiency and optimization opportunities
4. **Security**: Potential vulnerabilities or security concerns
5. **Suggestions**: Specific improvements with examples

Adjust your explanation level for ${difficulty} developers.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Please format your response with clear sections and bullet points.`;

    try {
      console.log('Sending code review request to Gemini API...');
      console.log('Prompt length:', prompt.length);
      
      const text = await this.generateContent(prompt);
      
      console.log('Received code review response from Gemini API');
      return text;
    } catch (error) {
      console.error('Detailed error in code review:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status,
        statusText: error.statusText
      });
      
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Gemini API configuration.');
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw new Error(`API Error: ${error.message || 'Failed to get code review. Please try again.'}`);
    }
  }

  async explainCode(code, language, difficulty = 'intermediate') {
    const prompt = `
    Please explain the following ${language} code in plain English for a ${difficulty} level developer:
    
    1. **Purpose**: What this code is trying to achieve
    2. **Flow**: Step-by-step breakdown of the logic
    3. **Key Concepts**: Important programming concepts used
    4. **Output**: What the code produces or returns
    
    Code to explain:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Make it easy to understand with clear explanations.
    `;

    try {
      const text = await this.generateContent(prompt);
      return text;
    } catch (error) {
      console.error('Error in code explanation:', error);
      throw new Error(`Failed to explain code: ${error.message}`);
    }
  }

  async findBugs(code, language) {
    const prompt = `As a code quality expert, analyze the following ${language} code and identify:

1. **Syntax Errors**: Any syntax mistakes
2. **Logic Flaws**: Potential logical errors or edge cases
3. **Runtime Errors**: Possible exceptions or crashes
4. **Code Smells**: Bad practices that could lead to issues
5. **Fixes**: Specific solutions for each issue found

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

If no issues are found, mention that the code looks clean and suggest any minor improvements.`;

    try {
      const text = await this.generateContent(prompt);
      return text;
    } catch (error) {
      console.error('Error in bug detection:', error);
      throw new Error(`Failed to analyze bugs: ${error.message}`);
    }
  }

  async lineByLineExplanation(code, language, difficulty = 'intermediate') {
    const prompt = `Please provide a line-by-line explanation of the following ${language} code for a ${difficulty} level developer:

For each line (or logical block), explain:
- What it does
- Why it's needed
- How it contributes to the overall functionality

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Format as: Line X: [code] → [explanation]`;

    try {
      const text = await this.generateContent(prompt);
      return text;
    } catch (error) {
      console.error('Error in line-by-line explanation:', error);
      throw new Error(`Failed to provide line-by-line explanation: ${error.message}`);
    }
  }

  async compareCode(code1, code2, language) {
    const prompt = `Compare these two ${language} code snippets and analyze:

1. **Functionality**: Do they achieve the same goal?
2. **Performance**: Which is more efficient and why?
3. **Readability**: Which is clearer and more maintainable?
4. **Best Practices**: Which follows better coding standards?
5. **Recommendation**: Which approach is better overall and why?

Code Snippet 1:
\`\`\`${language}
${code1}
\`\`\`

Code Snippet 2:
\`\`\`${language}
${code2}
\`\`\`

Provide a detailed comparison with specific examples.`;

    try {
      const text = await this.generateContent(prompt);
      return text;
    } catch (error) {
      console.error('Error in code comparison:', error);
      throw new Error(`Failed to compare code snippets: ${error.message}`);
    }
  }

  async refactorCode(code, language, difficulty = 'intermediate') {
    const prompt = `Please refactor the following ${language} code to make it cleaner, more readable, and more efficient:

Focus on:
1. **Clean Code Principles**: Better naming, structure, and organization
2. **Performance**: Optimize for better performance where possible
3. **Maintainability**: Make it easier to understand and modify
4. **Best Practices**: Apply modern ${language} conventions

Original code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The refactored code
2. Explanation of changes made
3. Benefits of the refactoring

Adjust complexity for ${difficulty} level developers.`;

    try {
      const text = await this.generateContent(prompt);
      return text;
    } catch (error) {
      console.error('Error in code refactoring:', error);
      throw new Error(`Failed to refactor code: ${error.message}`);
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;
