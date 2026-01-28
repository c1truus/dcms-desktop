#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "❌ Commit message required"
  echo "Usage: ./git-push.sh \"your commit message\""
  exit 1
fi

MSG="$1"

git status
git add .
git commit -m "$MSG" || echo "ℹ️ Nothing to commit"
git push origin main

echo "✅ Pushed to GitHub"
