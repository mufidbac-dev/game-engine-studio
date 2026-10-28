param(
  [Parameter(Mandatory=$true)][string]$RepoUrl,
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$hasOrigin = git remote | Where-Object { $_ -eq "origin" }
if ($hasOrigin) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

git branch -M $Branch
git push -u origin $Branch
Write-Host "✅ Successfully connected and pushed VGC Game Engine Studio to $RepoUrl ($Branch)!" -ForegroundColor Green
