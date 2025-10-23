@echo off
REM 微信金句分享墙 - Windows 快速初始化脚本
REM 使用方法: init.bat

echo ============================================
echo 🚀 微信金句分享墙 - 快速初始化
echo ============================================
echo.

REM 检查是否在正确的目录
if not exist "index.html" (
    echo ❌ 错误：请在项目根目录运行此脚本！
    pause
    exit /b 1
)

REM 检查 git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未检测到 Git，请先安装 Git
    pause
    exit /b 1
)

echo 📝 请输入配置信息：
echo.

set /p GITHUB_USERNAME="GitHub 用户名: "
set /p REPO_NAME="仓库名称: "
set /p GITHUB_TOKEN="GitHub Token: "

REM 验证输入
if "%GITHUB_USERNAME%"=="" (
    echo ❌ 错误：GitHub 用户名不能为空！
    pause
    exit /b 1
)
if "%REPO_NAME%"=="" (
    echo ❌ 错误：仓库名称不能为空！
    pause
    exit /b 1
)
if "%GITHUB_TOKEN%"=="" (
    echo ❌ 错误：GitHub Token 不能为空！
    pause
    exit /b 1
)

echo.
echo 🔧 开始配置...

REM 备份原文件
echo 📦 备份原始文件...
copy /Y index.html index.html.backup >nul

REM 使用 PowerShell 替换配置
echo ✏️  更新配置...
powershell -Command "(Get-Content index.html) -replace 'YOUR_GITHUB_TOKEN', '%GITHUB_TOKEN%' | Set-Content index.html"
powershell -Command "(Get-Content index.html) -replace 'YOUR_USERNAME', '%GITHUB_USERNAME%' | Set-Content index.html"
powershell -Command "(Get-Content index.html) -replace 'YOUR_REPO_NAME', '%REPO_NAME%' | Set-Content index.html"

echo ✅ 配置完成！
echo.

REM 初始化 Git 仓库（如果需要）
if not exist ".git" (
    echo 🔨 初始化 Git 仓库...
    git init
    git branch -M main
)

REM 添加远程仓库
echo 🔗 添加远程仓库...
git remote remove origin 2>nul
git remote add origin "https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git"

REM 添加并提交文件
echo 📤 准备提交文件...
git add .
git commit -m "Initial commit: 微信金句分享墙"

echo.
echo ============================================
echo ✅ 初始化完成！
echo ============================================
echo.
echo 📋 下一步操作：
echo.
echo 1. 推送到 GitHub:
echo    git push -u origin main
echo.
echo 2. 启用 GitHub Pages:
echo    - 访问 https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings/pages
echo    - Source 选择: Deploy from a branch
echo    - Branch 选择: main / (root)
echo.
echo 3. 配置 Actions 权限:
echo    - 访问 https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings/actions
echo    - 选择: Read and write permissions
echo.
echo 4. 访问你的网站:
echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo 📚 详细说明请查看 SETUP.md
echo.
echo ⭐ 如有问题，请提交 Issue
echo.
pause
