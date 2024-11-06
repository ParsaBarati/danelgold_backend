@echo off
setlocal

if "%1"=="" (
    echo Usage: switch_repo.bat [prod|dev]
    exit /b 1
)

REM Remove existing origin
git remote remove origin

if "%1"=="prod" (
    REM Set up production repo
    git remote add origin https://github.com/ParsaBarati/danelgold_backend.git
    git branch -m main
    echo Switched to production repository with main branch.
) else if "%1"=="dev" (
    REM Set up development repo
    git remote add origin https://github.com/MoeinSS/danelGold-nest.git
    git branch -m master
    echo Switched to development repository with master branch.
) else (
    echo Invalid option. Use "prod" for production or "dev" for development.
    exit /b 1
)

REM Stage all changes and commit
git add .
git commit -m "Latest changes"
echo Changes added and committed.
