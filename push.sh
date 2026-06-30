#!/bin/bash

# GitHub Push Script for Guitar Fretboard Trainer
# Usage: bash push.sh <your-github-token>
# Or: bash push.sh (will prompt for token)

USERNAME="vybetones"
REPO="vybetones"

# Get token from argument or prompt
if [ -n "$1" ]; then
    TOKEN="$1"
else
    echo "Enter your GitHub token:"
    read -s TOKEN
    echo ""
fi

if [ -z "$TOKEN" ]; then
    echo "Error: Token cannot be empty"
    exit 1
fi

echo "Setting up GitHub authentication..."

# Save credentials
echo "https://$USERNAME:$TOKEN@github.com" > ~/.git-credentials

# Configure git
git config --global credential.helper store
git config --global user.name "$USERNAME"
git config --global user.email "openclawnoel77@gmail.com"

# Set remote URL
cd "$(dirname "$0")"
git remote set-url origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO.git"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "Done! Repository is now connected to GitHub."
echo "Visit: https://github.com/$USERNAME/$REPO"
