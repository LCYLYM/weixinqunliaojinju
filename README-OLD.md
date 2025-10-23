# 📱 微信群聊金句墙 - Vercel版

> 🚀 **一键部署到Vercel,无需GitHub Actions和Pages!**  
> 用户无需登录,直接上传金句截图,数据自动保存到GitHub仓库

**在线访问：部署后由Vercel提供链接**

---

## ✨ 特性

- ✅ **完全匿名上传** - 用户无需任何登录
- ✅ **一键Vercel部署** - 5分钟完成部署
- ✅ **数据存储GitHub** - 利用GitHub作为图床和数据库
- ✅ **Claude风格UI** - 优雅的交互动画
- ✅ **自动举报机制** - 3次举报自动隐藏
- ✅ **Serverless架构** - 零运维成本
- ©️ **生🐟** - 用心制作

---

## 🎯 快速开始

### � 访客使用

1. 访问 https://lcylym.github.io/weixinqunliaojinju/
2. 点击"📤 上传金句"
3. 在 GitHub Issue 页面粘贴截图（Ctrl+V）
4. 勾选确认，点击 Submit
5. 等待 1-2 分钟，刷新页面查看

### 🚫 举报不当内容

1. 点击金句下方的"🚫 举报"按钮
2. 跳转到对应 Issue
3. 评论"举报"或"不当内容"
4. 举报超过 3 次自动隐藏

---

## � 管理员部署

### 方法一：Fork 本仓库

1. **Fork 仓库** 到你的账号
2. **启用 Pages**: Settings → Pages → Source: `main` branch
3. **配置 Actions**: Settings → Actions → General:
   - Workflow permissions: `Read and write`
   - 勾选 Allow GitHub Actions to create PR
4. **修改配置**: 编辑 `index.html` 中的 CONFIG:
   ```javascript
   const CONFIG = {
       REPO_OWNER: '你的用户名',
       REPO_NAME: '你的仓库名',
       BRANCH: 'main',
       WORKFLOW_FILE: 'update-quotes.yml'
   };
   ```
5. **完成！** 访问 `https://你的用户名.github.io/仓库名/`

### 方法二：从零开始

详细步骤查看 [USAGE.md](./USAGE.md) 📖

---

## 🛠️ 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/LCYLYM/weixinqunliaojinju.git
cd weixinqunliaojinju

# 2. 安装依赖
npm install

# 3. 创建 .env 文件
cat > .env << EOF
GITHUB_TOKEN=你的GitHub_Token
GITHUB_OWNER=LCYLYM
GITHUB_REPO=weixinqunliaojinju
EOF

# 4. 启动本地开发服务器
npm run dev

# 5. 访问 http://localhost:3000
```

---

## 📁 项目结构

```
weixinqunliaojinju/
├── api/                    # Vercel Serverless Functions
│   ├── upload.js          # 处理图片上传
│   ├── quotes.js          # 获取金句列表
│   └── report.js          # 举报功能
├── public/                # 静态前端文件
│   └── index.html         # 主页面(Claude风格)
├── quotes/                # GitHub存储的图片目录
├── quotes.json            # 金句数据库(JSON)
├── package.json           # 项目依赖
├── vercel.json            # Vercel配置
└── README.md              # 本文档
```

---

## 🔧 API接口

### 1. 上传金句
```http
POST /api/upload
Content-Type: application/json

{
  "image": "data:image/png;base64,iVBORw0KG..."
}
```

### 2. 获取金句列表
```http
GET /api/quotes
```

### 3. 举报金句
```http
POST /api/report
Content-Type: application/json

{
  "quoteId": 1698765432000
}
```

---

## 🎨 自定义样式

编辑 `public/index.html` 中的CSS变量:

```css
:root {
    --color-primary: #C96442;        /* 主色调 */
    --color-background: #FAF9F5;     /* 背景色 */
    --color-card-bg: #FFFFFF;        /* 卡片背景 */
}
```

---

## 🛠️ 技术栈

- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: GitHub Repository (图片 + JSON)
- **Hosting**: Vercel
- **API**: GitHub REST API v3 (@octokit/rest)

---

## 🐛 常见问题

### Q1: 上传后看不到图片?
**A**: 检查GitHub Token权限,确保包含`repo`权限。

### Q2: API返回403错误?
**A**: Token可能过期或权限不足,重新生成Token。

### Q3: Vercel部署失败?
**A**: 检查`vercel.json`配置和环境变量是否正确。

### Q4: 图片加载慢?
**A**: GitHub Raw服务在国内访问较慢,可考虑配置CDN代理:
```javascript
// 修改 api/upload.js 中的图片URL
const cdnUrl = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@main/${filePath}`;
```

---

## � 性能优化建议

1. **图片压缩**: 上传前自动压缩图片(可在前端实现)
2. **CDN加速**: 使用jsDelivr加速GitHub图片
3. **懒加载**: 已实现`loading="lazy"`
4. **缓存策略**: Vercel自动处理静态资源缓存

---

## � 安全说明

- ✅ **Token安全**: Token存储在Vercel环境变量,前端无法访问
- ✅ **CORS配置**: API已配置CORS,仅允许特定来源
- ✅ **文件验证**: 限制上传文件大小(10MB)和类型
- ✅ **自动审核**: 3次举报自动隐藏内容

---

## � 更新日志

### v3.0.0 (2025-10-23) ⭐ 最新
- 🎉 **全新架构**: Vercel Serverless部署
- ✨ 用户无需登录,完全匿名上传
- 🔒 Token安全存储在服务端
- 🚀 一键部署,零配置
- 📱 Claude风格UI重构

### v2.0.0 (2025-10-23)
- 🎉 改用 GitHub Issues 作为数据库
- 🔒 移除前端Token

### v1.0.0 (2025-10-22)
- 🚀 初始版本

---

## 📄 开源协议

MIT License - 自由使用、修改、分发

---

## 💖 鸣谢

- [Vercel](https://vercel.com) - 免费Serverless托管
- [GitHub](https://github.com) - 免费图床和数据存储
- [Lottiefiles](https://lottiefiles.com) - 动画资源
- [Claude](https://claude.ai) - UI设计灵感

---

## �‍💻 作者

**©️生🐟**

如有问题,欢迎提Issue! 🚀

---

## 📄 开源协议

MIT License - 自由使用、修改、分发

---

<div align="center">

**©️ 生🐟 · 2025**

Powered by Vercel + GitHub · 永久免费

[部署教程](#-部署步骤) · [提交问题](../../issues) · [⭐ 给个Star](../../stargazers)

</div>
