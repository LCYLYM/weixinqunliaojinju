#!/bin/bash

# 微信金句分享墙 - 快速初始化脚本
# 使用方法: ./init.sh

echo "🚀 微信金句分享墙 - 快速初始化"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本！"
    exit 1
fi

# 检查 git 是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误：未检测到 Git，请先安装 Git"
    exit 1
fi

echo "📝 请输入配置信息："
echo ""

# 读取用户输入
read -p "GitHub 用户名: " GITHUB_USERNAME
read -p "仓库名称: " REPO_NAME
read -sp "GitHub Token (输入不显示): " GITHUB_TOKEN
echo ""

# 验证输入
if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误：所有字段都是必需的！"
    exit 1
fi

echo ""
echo "🔧 开始配置..."

# 备份原文件
echo "📦 备份原始文件..."
cp index.html index.html.backup

# 使用 sed 替换配置
echo "✏️  更新配置..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/YOUR_GITHUB_TOKEN/${GITHUB_TOKEN}/g" index.html
    sed -i '' "s/YOUR_USERNAME/${GITHUB_USERNAME}/g" index.html
    sed -i '' "s/YOUR_REPO_NAME/${REPO_NAME}/g" index.html
else
    # Linux
    sed -i "s/YOUR_GITHUB_TOKEN/${GITHUB_TOKEN}/g" index.html
    sed -i "s/YOUR_USERNAME/${GITHUB_USERNAME}/g" index.html
    sed -i "s/YOUR_REPO_NAME/${REPO_NAME}/g" index.html
fi

echo "✅ 配置完成！"
echo ""

# 初始化 Git 仓库（如果需要）
if [ ! -d ".git" ]; then
    echo "🔨 初始化 Git 仓库..."
    git init
    git branch -M main
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# 添加并提交文件
echo "📤 准备提交文件..."
git add .
git commit -m "Initial commit: 微信金句分享墙"

echo ""
echo "✅ 初始化完成！"
echo ""
echo "📋 下一步操作："
echo "1. 推送到 GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. 启用 GitHub Pages:"
echo "   - 访问 https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/pages"
echo "   - Source 选择: Deploy from a branch"
echo "   - Branch 选择: main / (root)"
echo ""
echo "3. 配置 Actions 权限:"
echo "   - 访问 https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/actions"
echo "   - 选择: Read and write permissions"
echo ""
echo "4. 访问你的网站:"
echo "   https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""
echo "📚 详细说明请查看 SETUP.md"
echo ""
echo "⭐ 如有问题，请提交 Issue: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/issues"
