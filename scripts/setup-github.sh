#!/usr/bin/env bash
set -e

REPO_URL="$1"
BRANCH="${2:-main}"

if [ -z "$REPO_URL" ]; then
  echo "Usage: bash scripts/setup-github.sh https://github.com/<username>/<repo>.git [branch]"
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git branch -M "$BRANCH"
git push -u origin "$BRANCH"
echo "✅ Successfully connected and pushed VGC Game Engine Studio to $REPO_URL ($BRANCH)!"
