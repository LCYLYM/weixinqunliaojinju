# 🚀 部署配置指南

## 📋 前置准备清单

- [ ] GitHub 账号
- [ ] Git 已安装（可选，可直接在 GitHub 网页操作）
- [ ] 一个用于存放项目的仓库

---

## 🎯 详细配置步骤

### 第一步：创建 GitHub Personal Access Token

1. **登录 GitHub**，点击右上角头像 → `Settings`

2. **进入开发者设置**
   - 左侧菜单滚动到底部，点击 `Developer settings`
   - 选择 `Personal access tokens` → `Tokens (classic)`

3. **生成新 Token**
   - 点击 `Generate new token (classic)`
   - Note 名称填写：`wechat-quotes-token`
   - Expiration（过期时间）选择：`90 days` 或 `No expiration`（不推荐）
   
4. **选择权限**（必需）
   ```
   ✅ repo (完整的仓库控制)
      ├─ repo:status
      ├─ repo_deployment
      ├─ public_repo
      └─ repo:invite
   
   ✅ workflow (更新 GitHub Actions 工作流)
   ```

5. **生成并保存 Token**
   - 点击页面底部 `Generate token`
   - ⚠️ **立即复制并保存 Token**（只显示一次！）
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 第二步：上传项目到 GitHub

#### 方法 A：通过 Git 命令（推荐）

```bash
# 1. 进入项目目录
cd d:\vscode\gayhub\金句

# 2. 初始化 Git（如果还没有）
git init

# 3. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 4. 添加所有文件
git add .

# 5. 提交
git commit -m "Initial commit: 微信金句分享墙"

# 6. 推送到 GitHub
git push -u origin main
```

#### 方法 B：通过 GitHub 网页上传

1. 在 GitHub 创建新仓库
2. 点击 `uploading an existing file`
3. 拖拽项目文件夹到浏览器
4. 点击 `Commit changes`

---

### 第三步：配置 GitHub Actions 权限

1. **进入仓库设置**
   - 打开你的仓库页面
   - 点击 `Settings` 标签

2. **设置 Actions 权限**
   - 左侧菜单选择 `Actions` → `General`
   - 找到 **Workflow permissions** 部分
   - 选择：
     ```
     ✅ Read and write permissions
     ✅ Allow GitHub Actions to create and approve pull requests
     ```
   - 点击 `Save`

---

### 第四步：启用 GitHub Pages

1. **进入 Pages 设置**
   - 仓库页面 → `Settings` → `Pages`

2. **配置部署源**
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/(root)`
   - 点击 `Save`

3. **等待部署**
   - 页面顶部会显示：
     ```
     ✅ Your site is live at https://你的用户名.github.io/仓库名/
     ```
   - 首次部署需要 1-3 分钟

---

### 第五步：配置前端代码

1. **编辑 `index.html`**
   - 打开文件，找到第 279-284 行左右的配置：

   ```javascript
   const CONFIG = {
       GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxx',  // 👈 粘贴你的 Token
       REPO_OWNER: 'your-username',               // 👈 你的 GitHub 用户名
       REPO_NAME: 'your-repo-name',               // 👈 仓库名称
       BRANCH: 'main',                            // 分支名（通常是 main）
       WORKFLOW_FILE: 'update-quotes.yml'         // 保持不变
   };
   ```

2. **示例配置**
   ```javascript
   // 假设你的 GitHub 用户名是 zhangsan，仓库名是 wechat-quotes
   const CONFIG = {
       GITHUB_TOKEN: 'ghp_abc123def456ghi789jkl012mno345pqr678',
       REPO_OWNER: 'zhangsan',
       REPO_NAME: 'wechat-quotes',
       BRANCH: 'main',
       WORKFLOW_FILE: 'update-quotes.yml'
   };
   ```

3. **保存并提交**
   ```bash
   git add index.html
   git commit -m "配置 GitHub Token 和仓库信息"
   git push
   ```

---

### 第六步：测试功能

1. **访问网站**
   ```
   https://你的用户名.github.io/仓库名/
   ```

2. **测试上传**
   - 点击上传区域
   - 选择一张图片
   - 点击"提交金句"
   - 等待 10-20 秒后刷新页面

3. **查看 Actions 执行情况**
   - 仓库页面 → `Actions` 标签
   - 查看 `Update Quotes` 工作流是否成功

---

## 🔍 故障排查

### 问题 1: 上传后没有显示

**可能原因：**
- Actions 还在执行中
- Token 配置错误
- 权限不足

**解决方法：**
1. 查看 Actions 日志（仓库 → Actions → 最新运行记录）
2. 检查 Token 和仓库信息是否正确
3. 确认 Actions 权限已开启

### 问题 2: 显示 "GitHub API 请求失败"

**可能原因：**
- Token 无效或过期
- Token 权限不足
- 仓库信息填写错误

**解决方法：**
1. 重新生成 Token 并更新
2. 确认 Token 有 `repo` 和 `workflow` 权限
3. 检查 `REPO_OWNER` 和 `REPO_NAME` 拼写

### 问题 3: Actions 执行失败

**可能原因：**
- workflow 权限未开启
- quotes.json 不存在
- 脚本执行错误

**解决方法：**
1. 检查 Settings → Actions → General 权限设置
2. 确认 `quotes.json` 文件存在（内容为 `[]`）
3. 查看 Actions 详细日志定位错误

---

## 📊 配置清单总结

| 步骤 | 配置项 | 必需 | 状态 |
|------|--------|------|------|
| 1 | GitHub Token | ✅ | ⬜ |
| 2 | 上传代码到仓库 | ✅ | ⬜ |
| 3 | Actions 权限 | ✅ | ⬜ |
| 4 | GitHub Pages | ✅ | ⬜ |
| 5 | 修改 CONFIG | ✅ | ⬜ |
| 6 | 测试功能 | ✅ | ⬜ |

---

## 🎉 配置完成！

完成以上步骤后，你的微信金句分享墙就可以正常使用了！

如有问题，请查看：
- [README.md](./README.md) - 项目说明
- [GitHub Issues](../../issues) - 提交问题

---

**⭐ 觉得有用？给个 Star 吧！**
