#!/bin/bash
# Commands to run after creating your new GitHub repository
# Replace 'your-username' and 'repository-name' with your actual values

echo "🔄 Step 1: Remove old remote"
git remote remove origin

echo "🔗 Step 2: Add new remote (replace with your repository URL)"
echo "Run: git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git"

echo "📤 Step 3: Push to new repository"
echo "Run: git push -u origin main"

echo ""
echo "🎉 Your repository will be live at:"
echo "https://github.com/YOUR-USERNAME/YOUR-REPO-NAME"