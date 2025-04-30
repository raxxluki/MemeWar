#!/bin/bash

# MemeWar Deployment Script
# This script helps with initializing git and pushing to GitHub

echo "=== MemeWar Deployment Helper ==="
echo "This script will help you initialize git and push to GitHub."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Initialize git if .git directory doesn't exist
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already initialized."
fi

# Add files to git
echo "Adding files to git..."
git add .
echo "Files added to git."

# Commit files
echo "Committing files..."
git commit -m "Initial commit of MemeWar project"
echo "Files committed."

# Prompt for GitHub username and repository name
echo ""
echo "Please enter your GitHub username:"
read github_username

echo "Please enter your repository name (e.g., meme-war):"
read repo_name

# Add remote origin
echo ""
echo "Adding remote origin..."
git remote add origin "https://github.com/$github_username/$repo_name.git"
echo "Remote origin added."

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
echo "You may be prompted to enter your GitHub credentials."
git push -u origin main || git push -u origin master

echo ""
echo "=== Next Steps ==="
echo "1. Go to https://vercel.com and sign in with your GitHub account"
echo "2. Import your repository: $repo_name"
echo "3. Configure the project with the following settings:"
echo "   - Framework Preset: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "4. Add your Firebase environment variables in the Vercel dashboard"
echo "5. Click 'Deploy'"
echo ""
echo "For detailed instructions, refer to DEPLOYMENT_GUIDE.md"