#!/bin/bash

# Debug version of push script

USERNAME="vybetones"
REPO="vybetones"

echo "Debug script started"
echo "Number of arguments: $#"

if [ -n "$1" ]; then
    TOKEN="$1"
    echo "Token provided as argument. Length: ${#TOKEN}"
    echo "First 10 chars: ${TOKEN:0:10}"
    echo "Last 10 chars: ${TOKEN: -10}"
else
    echo "No argument provided, will prompt for input"
    echo -n "Enter your GitHub Personal Access Token: "
    read -s TOKEN
    echo ""
fi

if [ -z "$TOKEN" ]; then
    echo "Error: Token cannot be empty"
    exit 1
fi

echo "Using token of length ${#TOKEN}"

# Just show what we would do, don't actually execute git commands
echo "Would set up credentials for $USERNAME/$REPO"
echo "Would push to origin main"