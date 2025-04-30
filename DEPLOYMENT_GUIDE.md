# MemeWar Deployment Guide

This guide will walk you through the process of committing your MemeWar project to GitHub and deploying it to Vercel.

## 1. Preparing Your Project for GitHub

Before committing to GitHub, let's set up some essential files:

### Create a .gitignore file

Create a `.gitignore` file in your project root to avoid committing sensitive information:

```
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# production
build
dist

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Firebase config with real API keys
.env.firebase
```

### Update Firebase Configuration

For security, modify your `firebase.js` file to use environment variables instead of hardcoded values:

```javascript
// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "memewar-canvas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "memewar-canvas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "memewar-canvas.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef1234567890",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ"
};

// Rest of your firebase.js file remains the same
```

### Create a README.md

Create a comprehensive README.md file in your project root with information about your project.

## 2. Committing to GitHub

### Initialize Git Repository

```bash
# Navigate to your project directory
cd /Users/user/MemeWar

# Initialize git repository
git init

# Add all files to staging
git add .

# Commit the files
git commit -m "Initial commit of MemeWar project"
```

### Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the '+' icon in the top-right corner and select 'New repository'
3. Name your repository (e.g., "meme-war")
4. Keep it public or private as per your preference
5. Do not initialize with README, .gitignore, or license as we already have our files
6. Click 'Create repository'

### Link and Push to GitHub

After creating the repository, GitHub will show commands to push an existing repository. Use these commands:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/meme-war.git

# Push your code to GitHub
git push -u origin main
```

Note: If your default branch is named 'master' instead of 'main', use `git push -u origin master`

## 3. Deploying to Vercel

### Prepare for Vercel Deployment

Ensure your project is properly configured for Vercel deployment:

1. Your project is already using Vite, which works well with Vercel
2. The build commands in package.json are correctly set up

### Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/sign in (you can use your GitHub account)
2. Click 'Add New...' > 'Project'
3. Import your GitHub repository (you may need to install Vercel on your GitHub account)
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (should be detected automatically)
   - Output Directory: `dist` (should be detected automatically)
   - Install Command: `npm install` (should be detected automatically)

5. Add Environment Variables:
   - Click on 'Environment Variables' and add your Firebase configuration:
     - VITE_FIREBASE_API_KEY: Your actual Firebase API key
     - VITE_FIREBASE_AUTH_DOMAIN: Your Firebase auth domain
     - VITE_FIREBASE_PROJECT_ID: Your Firebase project ID
     - VITE_FIREBASE_STORAGE_BUCKET: Your Firebase storage bucket
     - VITE_FIREBASE_MESSAGING_SENDER_ID: Your Firebase messaging sender ID
     - VITE_FIREBASE_APP_ID: Your Firebase app ID
     - VITE_FIREBASE_MEASUREMENT_ID: Your Firebase measurement ID

6. Click 'Deploy'

### After Deployment

- Vercel will provide you with a deployment URL (e.g., https://meme-war.vercel.app)
- You can configure a custom domain in the Vercel project settings if desired

## 4. Updating Your Deployment

Whenever you make changes to your project:

1. Commit your changes to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. Vercel will automatically detect the changes and redeploy your application

## Troubleshooting

### Firebase Connection Issues

If you encounter issues with Firebase connectivity:

1. Ensure your Firebase project has the correct security rules
2. Verify that all environment variables are correctly set in Vercel
3. Check that your Firebase project allows requests from your Vercel domain

### Build Failures

If your build fails on Vercel:

1. Check the build logs for specific errors
2. Ensure all dependencies are correctly listed in package.json
3. Verify that your code doesn't contain any environment-specific paths

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)