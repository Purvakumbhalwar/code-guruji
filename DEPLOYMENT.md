# Deployment Guide for Code Guruji

This guide covers how to deploy Code Guruji to various hosting platforms while keeping your API keys secure.

## Environment Variables Setup

For production deployments, you'll need to set the `REACT_APP_GEMINI_API_KEY` environment variable on your hosting platform.

## Platform-Specific Deployment Instructions

### 1. Vercel

1. **Push to GitHub** (without .env file)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
3. **Set Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_GEMINI_API_KEY` = `your_api_key`
4. **Deploy**: Vercel will automatically build and deploy

### 2. Netlify

1. **Push to GitHub** (without .env file)
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - New site from Git → Choose your repository
3. **Set Environment Variables**:
   - Site Settings → Environment Variables
   - Add: `REACT_APP_GEMINI_API_KEY` = `your_api_key`
4. **Deploy**: Build command: `npm run build`, Publish directory: `build`

### 3. GitHub Pages

1. **Create GitHub Actions Workflow**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
           env:
             REACT_APP_GEMINI_API_KEY: ${{ secrets.REACT_APP_GEMINI_API_KEY }}
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./build
   ```

2. **Set GitHub Secret**:
   - Repository Settings → Secrets and variables → Actions
   - Add: `REACT_APP_GEMINI_API_KEY`

### 4. Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

3. **Build with Environment Variables**:
   ```bash
   REACT_APP_GEMINI_API_KEY=your_api_key npm run build
   ```

4. **Deploy**:
   ```bash
   firebase deploy
   ```

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] API key is set as environment variable on hosting platform
- [ ] No hardcoded API keys in source code
- [ ] Repository is public but `.env` is never committed
- [ ] API key has appropriate usage limits set

## Troubleshooting

### Common Issues

1. **"API key not found" error**:
   - Check environment variable name: `REACT_APP_GEMINI_API_KEY`
   - Ensure environment variable is set on hosting platform
   - Verify API key is correct

2. **Build fails**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Verify build command: `npm run build`

3. **API not working in production**:
   - Check CORS settings
   - Verify API key permissions
   - Check browser console for errors

## API Key Management

### Best Practices

1. **Different Keys for Different Environments**:
   - Development: Personal API key
   - Production: Dedicated API key with usage limits

2. **Monitor Usage**:
   - Check Google Cloud Console for API usage
   - Set up billing alerts
   - Monitor for unusual activity

3. **Key Rotation**:
   - Regularly rotate API keys
   - Update environment variables on all platforms
   - Test after rotation

### Rate Limiting

The free tier of Gemini API has limits:
- 60 requests per minute
- 1,500 requests per day

Consider implementing client-side rate limiting or usage tracking for production apps.

## Performance Optimization

1. **Enable Gzip Compression** (most platforms do this automatically)
2. **Use CDN** for static assets
3. **Enable Caching** for API responses
4. **Optimize Bundle Size**:
   ```bash
   npm run build
   npm install -g serve
   serve -s build
   ```

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- API usage tracking

---

Remember: Never commit your `.env` file or expose your API keys in client-side code. Always use environment variables for sensitive configuration!
