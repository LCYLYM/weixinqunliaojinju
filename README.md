# 📱 微信金句分享墙

一个基于 GitHub Pages + GitHub Actions 的金句分享平台，支持多端同步、匿名上传、举报隐藏等功能。

**在线访问：https://lcylym.github.io/weixinqunliaojinju/**

---

## ✨ 功能特性

- 📤 **匿名上传** - 无需登录，直接上传金句图片
- 🔄 **多端同步** - 数据存储在 GitHub，所有设备实时同步
- 🚫 **举报隐藏** - 举报次数达到 2 次自动隐藏
- 🎲 **随机抽取** - 随机查看一条金句
- 📊 **统计展示** - 实时显示金句数量
- 🎨 **精美界面** - 参考 Claude 风格设计
- 🔐 **安全可控** - Fine-grained Token 仅授权单个仓库
- ©️ **生🐟** - 用心制作

---

## 🎯 使用方式

### 👀 访客使用

直接访问网站即可浏览和上传金句：

```
https://lcylym.github.io/weixinqunliaojinju/
```

1. 点击上传区域或拖拽图片
2. 预览无误后点击"提交金句"
3. 等待 10-20 秒后刷新页面查看

---

## 🔧 管理员部署

### 第一步：Fork 仓库

点击右上角的 `Fork` 按钮，将仓库 fork 到你的账号下。

### 第二步：创建 Fine-grained Token

**详细步骤请查看：[TOKEN_SETUP.md](./TOKEN_SETUP.md) 📖**

快速概览：
1. GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. 选择 **Only select repositories** → 仅授权你的仓库
3. 权限：`Contents (Read and write)` + `Workflows (Read and write)`
4. 生成并复制 Token（格式：`github_pat_xxxxxx`）

### 第三步：配置 Actions 权限

1. 进入仓库 `Settings` → `Actions` → `General`
2. **Workflow permissions** 选择：
   - ✅ `Read and write permissions`
   - ✅ `Allow GitHub Actions to create and approve pull requests`

### 第四步：启用 GitHub Pages

1. 进入仓库 `Settings` → `Pages`
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `(root)`

### 第五步：配置 Token

编辑 `index.html`（约第 280 行）：

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'github_pat_YOUR_TOKEN_HERE',  // 👈 替换为你的 Token
    REPO_OWNER: 'YOUR_USERNAME',                 // 👈 你的 GitHub 用户名
    REPO_NAME: 'YOUR_REPO_NAME',                 // 👈 仓库名
    BRANCH: 'main',
    WORKFLOW_FILE: 'update-quotes.yml'
};
```

### 第六步：提交并部署

```bash
git add index.html
git commit -m "配置 GitHub Token"
git push
```

等待 1-2 分钟后访问：
```
https://你的用户名.github.io/仓库名/
```

---

## 📁 项目结构

```
.
├── index.html                   # 主页面（包含所有前端代码）
├── quotes.json                  # 金句数据存储
├── .github/
│   ├── workflows/
│   │   ├── update-quotes.yml   # 更新金句的 Workflow
│   │   └── deploy.yml          # 部署 Workflow（可选）
│   └── scripts/
│       └── update-quotes.js    # 数据处理脚本
├── README.md                    # 本文件
├── TOKEN_SETUP.md               # Token 配置详细指南
├── SETUP.md                     # 完整部署指南（旧版）
└── PROJECT.md                   # 项目技术文档
```

---

## 🔐 安全说明

### Token 权限最小化

本项目使用 **Fine-grained Personal Access Token**：

✅ **仅授权单个仓库** - 只能操作指定的仓库  
✅ **最小权限** - 只有 Contents 和 Workflows 读写权限  
✅ **可设置过期** - 建议 90 天更换一次  
✅ **随时撤销** - 发现异常立即停用  

### 一人配置，所有人使用

- 管理员配置 Token 后，所有访客都能直接使用
- 无需每个用户授权
- Token 虽然在前端代码中，但权限已最小化

详细安全说明请查看 [TOKEN_SETUP.md](./TOKEN_SETUP.md)

---

## 🎨 样式定制

修改 `index.html` 中的 CSS 变量（约第 11-23 行）：

```css
:root {
    --color-primary: #C96442;       /* 主色调 */
    --color-background: #F5F4ED;    /* 背景色 */
    --color-text: #262624;          /* 文字颜色 */
    /* ... 更多变量 */
}
```

---

## 🛠️ 技术栈

- **HTML5 + CSS3** - 结构和样式
- **Vanilla JavaScript** - 逻辑处理（无框架依赖）
- **GitHub REST API** - 触发 Workflows
- **GitHub Actions** - 自动化数据处理
- **GitHub Pages** - 静态网站托管

---

## 🐛 常见问题

### 1. 上传后没有显示？

- 等待 10-20 秒后刷新页面
- 查看 [Actions 执行记录](https://github.com/LCYLYM/weixinqunliaojinju/actions)

### 2. 显示 "管理员尚未配置 GitHub Token"？

- 管理员需要按照上述步骤配置 Token
- 访客无需操作，等待管理员配置

### 3. Actions 执行失败？

- 检查 Token 是否正确配置
- 确认 Actions 权限已开启
- 查看 Actions 详细日志

---

## 📚 相关文档

- [TOKEN_SETUP.md](./TOKEN_SETUP.md) - Token 配置详细指南
- [PROJECT.md](./PROJECT.md) - 项目技术文档
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Fine-grained PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

---

## 📄 开源协议

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## ©️ 版权

©️ 生🐟 · 基于 GitHub Pages + Actions 构建

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
