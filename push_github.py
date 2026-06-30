#!/usr/bin/env python3
"""
GitHub push script for Guitar Fretboard Trainer
Usage: python push_github.py <your-full-token>
"""

import sys
import os
import subprocess

if len(sys.argv) < 2:
    print("Usage: python push_github.py <your-full-token>")
    print("Example: python push_github.py ***")
    sys.exit(1)

token = sys.argv[1]
username = "vybetones"
repo = "vybetones"

print(f"Token length: {len(token)}")
print("Setting up GitHub authentication...")

# Save credentials
home = os.path.expanduser("~")
credentials_path = os.path.join(home, ".git-credentials")
with open(credentials_path, 'w') as f:
    f.write(f"https://{username}:{token}@github.com\n")

# Configure git
subprocess.run(["git", "config", "--global", "credential.helper", "store"], check=True)
subprocess.run(["git", "config", "--global", "user.name", username], check=True)
subprocess.run(["git", "config", "--global", "user.email", "openclawnoel77@gmail.com"], check=True)

# Set remote URL
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([
    "git", "remote", "set-url", "origin",
    f"https://{username}:{token}@github.com/{username}/{repo}.git"
], check=True)

# Push to GitHub
print("Pushing to GitHub...")
result = subprocess.run(["git", "push", "-u", "origin", "main"], capture_output=True, text=True)

if result.returncode == 0:
    print("\nDone! Repository is now connected to GitHub.")
    print(f"Visit: https://github.com/{username}/{repo}")
else:
    print("\nError pushing to GitHub:")
    print(result.stderr)
    sys.exit(1)
