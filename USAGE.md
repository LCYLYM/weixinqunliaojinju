# 📱 微信金句分享墙 - 使用指南

## 🎯 全新架构：基于 GitHub Issues

### ✨ 为什么改用 Issues？

原来的方案需要在前端存储 Token，会被 GitHub Secret Scanning 检测并封禁。新方案完全不需要 Token：

- ✅ **无需 Token** - 用户通过 GitHub 网页提交
- ✅ **完全免费** - Issues 无限制，永久存储
- ✅ **自动同步** - Actions 监听 Issues 自动更新
- ✅ **安全可靠** - 无凭据暴露风险
- ✅ **易于管理** - 可直接关闭不当内容

---

## 📖 使用方法

### 1️⃣ **提交金句**

访问 https://lcylym.github.io/weixinqunliaojinju/

点击 "📤 上传金句" → 自动跳转到 GitHub Issue 创建页

在页面中:
1. **粘贴截图**: `Ctrl+V` 或拖拽图片
2. **勾选确认**: 确认无敏感信息
3. **点击 Submit**: 提交 Issue

⏰ **等待 1-2 分钟**，金句会自动出现在墙上！

### 2️⃣ **举报不当内容**

在金句卡片上点击 "🚫 举报" → 跳转到对应 Issue

在 Issue 中评论 "举报" 或 "不当内容"

✅ 举报超过 **3 次**自动隐藏

### 3️⃣ **管理员操作**

**隐藏金句**:
- 直接关闭对应 Issue
- 或添加 `hidden` 标签

**删除金句**:
- 关闭 Issue 并删除
- 下次同步时自动从墙上移除

**批量管理**:
- 使用 GitHub Issues 筛选、标签等功能

---

## 🔧 技术原理

### 数据流程

```
用户提交截图 (GitHub Issue)
          ↓
GitHub Actions 监听 (Issues Event)
          ↓
提取图片 URL (.github/scripts/sync-issues.js)
          ↓
更新 quotes.json (自动 commit)
          ↓
前端读取显示 (无需认证)
```

### 关键文件

| 文件 | 作用 |
|------|------|
| `.github/ISSUE_TEMPLATE/quote.yml` | Issue 提交表单 |
| `.github/workflows/sync-issues.yml` | 监听 Issues 事件 |
| `.github/scripts/sync-issues.js` | 同步逻辑 |
| `quotes.json` | 数据存储 |
| `index.html` | 前端展示 |

---

## 🚀 部署步骤

### 1. Fork 仓库

```bash
# 或克隆到自己的账号
git clone https://github.com/LCYLYM/weixinqunliaojinju.git
cd weixinqunliaojinju
```

### 2. 启用 GitHub Pages

进入仓库设置:
- Settings → Pages
- Source: Deploy from a branch
- Branch: `main` / `root`
- 保存

### 3. 启用 Actions 权限

Settings → Actions → General:
- **Workflow permissions**: Read and write permissions
- 勾选 "Allow GitHub Actions to create and approve pull requests"

### 4. 完成！

访问 `https://你的用户名.github.io/weixinqunliaojinju/`

---

## ❓ 常见问题

### Q: 提交后金句没出现？
**A**: 等待 1-2 分钟，Actions 需要时间运行。检查 Actions 标签页是否有错误。

### Q: 如何自定义样式？
**A**: 修改 `index.html` 中的 CSS 变量:
```css
:root {
    --color-primary: #C96442;  /* 主题色 */
    --chat-background-white: #F5F4ED;  /* 背景色 */
}
```

### Q: 可以限制提交权限吗？
**A**: 可以。Settings → Moderation options:
- Limit to collaborators only
- 或开启 Issue 审核

### Q: 如何备份数据？
**A**: `quotes.json` 包含所有数据，定期下载即可。也可以导出 Issues。

### Q: 能自动压缩图片吗？
**A**: GitHub 会自动优化上传的图片。如需进一步压缩，可以修改 sync-issues.js 脚本。

---

## 🎨 自定义配置

### 修改仓库信息

编辑 `index.html`:

```javascript
const CONFIG = {
    REPO_OWNER: '你的用户名',
    REPO_NAME: '你的仓库名',
    BRANCH: 'main',
    WORKFLOW_FILE: 'update-quotes.yml'
};
```

### 修改 Issue 模板

编辑 `.github/ISSUE_TEMPLATE/quote.yml`:

```yaml
title: "[金句] "  # 默认标题
labels: ["金句"]  # 标签
```

### 自定义举报阈值

编辑 `.github/scripts/sync-issues.js`:

```javascript
// 当前是 3 次，可修改为其他数字
const hidden = reportCount >= 3 || issue.state === 'closed';
```

---

## 📊 数据格式

`quotes.json` 结构:

```json
[
  {
    "id": 1729682400000,
    "issueId": 1,
    "issueUrl": "https://github.com/LCYLYM/weixinqunliaojinju/issues/1",
    "image": "https://user-images.githubusercontent.com/...",
    "timestamp": "2025-10-23T10:00:00Z",
    "reports": 0,
    "hidden": false
  }
]
```

---

## 🔒 隐私与安全

- ✅ **无敏感数据存储** - 仅存储公开图片链接
- ✅ **用户可控** - 提交者可随时删除自己的 Issue
- ✅ **社区监督** - 举报机制防止滥用
- ✅ **管理员审核** - 可开启 Issue 审核

---

## 📝 更新日志

### v2.0.0 (2025-10-23)
- 🎉 **重构**: 改用 GitHub Issues 作为数据库
- ✨ **新增**: Issue 模板和自动同步
- 🔒 **安全**: 移除所有前端 Token
- 📱 **优化**: 改进移动端体验

### v1.0.0
- 🚀 初始版本（基于 Token + Actions）

---

## 💡 灵感来源

受启发于:
- GitHub Issues as CMS
- GitHub Actions Automation
- Serverless Architecture

---

## 📞 联系方式

- 💬 提问题: [Issues](https://github.com/LCYLYM/weixinqunliaojinju/issues)
- 🐛 报告 Bug: [Issues](https://github.com/LCYLYM/weixinqunliaojinju/issues)
- ✨ 功能建议: [Issues](https://github.com/LCYLYM/weixinqunliaojinju/issues)

---

<div align="center">

**©️ 生🐟 · 2025**

Made with ❤️ using GitHub

</div>
