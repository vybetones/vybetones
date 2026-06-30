#!/bin/bash

# GitHub setup script for Guitar Fretboard Trainer
# Run this script with your full GitHub token

TOKEN="YOUR_TOKEN_HERE"
USERNAME="vybetones"
REPO="vybetones"

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

echo "Done! Repository is now connected to GitHub."
