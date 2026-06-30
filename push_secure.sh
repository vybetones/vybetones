#!/bin/bash

# GitHub Push Script - Secure Version
# Prompts for token interactively to avoid logging

USERNAME="vybetones"
REPO="vybetones"

echo "Setting up GitHub authentication for $USERNAME/$REPO"

# Prompt for token (input will be hidden)
echo -n "Enter your GitHub Personal Access Token: "
read -s TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "Error: Token cannot be empty"
    exit 1
fi

echo "Configuring git credentials..."

# Configure git to use token for this operation only
# Using credential.helper store for this session
git config --global credential.helper store

# Temporarily set credentials for this remote
# We'll use the credential helper approach by temporarily adding to .git-credentials
# but we'll clean it up after

# Save current credentials if any
cp ~/.git-credentials ~/.git-credentials.backup 2>/dev/null || true

# Write temporary credentials
echo "https://$USERNAME:$TOKEN@github.com" > ~/.git-credentials

# Set remote URL
cd "$(dirname "$0")"
git remote set-url origin https://github.com/$USERNAME/$REPO.git

# Attempt push
echo "Pushing to GitHub..."
git push -u origin main

# Result
RESULT=$?

# Clean up: restore original credentials
if [ -f ~/.git-credentials.backup ]; then
    mv ~/.git-credentials.backup ~/.git-credentials
else
    rm -f ~/.git-credentials
fi

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "Success! Repository is now connected to GitHub."
    echo "Visit: https://github.com/$USERNAME/$REPO"
else
    echo ""
    echo "Error: Push failed. Please check your token and try again."
    exit $RESULT
fi