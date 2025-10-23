# 📱 微信金句分享墙 - 项目总览

## 🎯 项目简介

这是一个基于 GitHub Pages + GitHub Actions 的纯前端金句分享平台。用户可以匿名上传金句图片，数据存储在 GitHub 仓库中，实现多端同步访问。

---

## 📦 完整功能列表

### ✅ 已实现功能

1. **图片上传**
   - 支持点击上传和拖拽上传
   - 自动压缩图片（最大宽度 800px，质量 80%）
   - Base64 编码存储
   - 实时预览

2. **数据管理**
   - 使用 GitHub Actions 自动更新数据
   - 数据持久化到 `quotes.json`
   - 多端实时同步

3. **举报系统**
   - 用户可举报不当内容
   - 举报 2 次自动隐藏
   - 统计显示举报次数

4. **展示功能**
   - 瀑布流网格布局
   - 响应式设计（支持移动端）
   - 时间智能显示（刚刚/X分钟前/X小时前等）
   - 平滑滚动动画

5. **交互功能**
   - 随机抽取金句
   - 卡片悬停效果
   - Toast 提示消息
   - 统计数据展示

### 🚀 技术特点

- **零后端** - 纯前端 + GitHub API
- **免费托管** - GitHub Pages 免费部署
- **自动化** - GitHub Actions 自动处理数据
- **安全性** - 支持 Token 权限控制

---

## 📂 项目结构

```
金句/
├── .github/
│   ├── workflows/
│   │   ├── update-quotes.yml      # 更新金句数据的 Workflow
│   │   └── deploy.yml             # 部署到 GitHub Pages (可选)
│   ├── scripts/
│   │   └── update-quotes.js       # 数据处理脚本
│   └── instructions/
│       └── codacy.instructions.md # Codacy 代码质量检查规则
│
├── index.html                      # 主页面（包含所有前端代码）
├── quotes.json                     # 金句数据存储
├── README.md                       # 项目说明文档
├── SETUP.md                        # 详细配置指南
├── PROJECT.md                      # 本文件 - 项目总览
├── .gitignore                      # Git 忽略规则
├── 设计和想法.md                   # 设计思路和技术方案
└── 网站整体css参考.txt             # 样式设计参考

```

---

## 🔧 核心技术栈

### 前端技术
- **HTML5** - 结构
- **CSS3** - 样式（CSS Variables + 动画）
- **Vanilla JavaScript** - 逻辑（无框架依赖）

### API 和服务
- **GitHub REST API** - 触发 Workflows
- **GitHub Actions** - 自动化数据处理
- **GitHub Pages** - 静态网站托管

### 关键 API
```javascript
// 触发 Workflow
POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches

// 读取数据文件
GET https://raw.githubusercontent.com/{owner}/{repo}/{branch}/quotes.json
```

---

## 📊 数据流程

### 上传流程
```
用户选择图片
    ↓
FileReader 读取文件
    ↓
Canvas API 压缩图片
    ↓
Base64 编码
    ↓
调用 GitHub API 触发 Workflow
    ↓
Workflow 执行 update-quotes.js
    ↓
更新 quotes.json
    ↓
Git commit & push
    ↓
用户刷新页面查看更新
```

### 举报流程
```
用户点击举报按钮
    ↓
触发 Workflow (action: report)
    ↓
查找对应金句
    ↓
reports 计数 +1
    ↓
reports >= 2 时设置 hidden = true
    ↓
更新 quotes.json
    ↓
前端过滤 hidden 项不显示
```

---

## 🎨 样式设计

### 设计理念
参考 Claude AI 的界面风格：
- 温暖的米色背景（`#F5F4ED`）
- 橘红色主题（`#C96442`）
- 柔和的阴影和圆角
- 流畅的过渡动画

### CSS 变量系统
```css
:root {
    --color-primary: #C96442;              /* 主色 */
    --color-background: #F5F4ED;           /* 背景色 */
    --color-text: #262624;                 /* 文字颜色 */
    --color-border: rgba(120,120,120,0.08); /* 边框色 */
    /* ... 更多变量 */
}
```

### 动画效果
1. **淡入动画** - 卡片加载时
2. **悬停效果** - 卡片/按钮悬停时上移
3. **滑入动画** - Toast 提示消息
4. **旋转动画** - 加载图标

---

## 🔐 安全考虑

### 当前方案的风险
- ⚠️ **Token 暴露** - 嵌入在前端代码中
- ⚠️ **滥用风险** - 恶意用户可能频繁调用 API

### 缓解措施
1. **Token 权限限制**
   - 仅授予单个仓库的访问权限
   - 使用 Fine-grained tokens
   - 设置过期时间

2. **举报机制**
   - 2 次举报自动隐藏
   - 社区自治

3. **未来改进方向**
   - 使用 Cloudflare Workers / Vercel Functions 代理
   - 实现 Rate Limiting（请求频率限制）
   - 添加简单的验证码机制

---

## 📝 配置文件说明

### `quotes.json` 数据结构
```json
[
  {
    "id": 1234567890123,              // 时间戳作为唯一 ID
    "image": "data:image/jpeg;base64,/9j/4AAQ...", // Base64 图片数据
    "timestamp": "2025-10-23T12:34:56.789Z",       // ISO 8601 时间戳
    "reports": 0,                     // 举报次数
    "hidden": false                   // 是否隐藏
  }
]
```

### `update-quotes.yml` 参数
```yaml
inputs:
  imageData:    # Base64 编码的图片数据
  action:       # 操作类型: 'add' | 'report'
  quoteId:      # 金句 ID（仅 report 时需要）
```

---

## 🚀 部署步骤概览

1. **Fork 仓库** → 复制到你的账号
2. **创建 Token** → GitHub Settings 生成
3. **配置权限** → 启用 Actions 读写权限
4. **启用 Pages** → Settings → Pages 配置
5. **修改代码** → 填入 Token 和仓库信息
6. **提交推送** → Git push 部署
7. **测试功能** → 访问并上传测试

详细步骤见 [SETUP.md](./SETUP.md)

---

## 🛠️ 本地开发

### 直接打开
```bash
# 用浏览器直接打开 index.html
open index.html  # macOS
start index.html # Windows
```

### 本地服务器（推荐）
```bash
# 使用 Python 启动简单服务器
python -m http.server 8000

# 或使用 Node.js
npx serve

# 访问 http://localhost:8000
```

### 测试 Workflow
```bash
# 安装 act (本地运行 GitHub Actions)
brew install act  # macOS
choco install act # Windows

# 运行 Workflow
act workflow_dispatch -s GITHUB_TOKEN=your_token
```

---

## 📈 性能优化

### 已实现
- ✅ 图片自动压缩（800px, 80% 质量）
- ✅ CSS 动画使用 GPU 加速（transform）
- ✅ 懒加载（仅显示未隐藏的金句）

### 可优化
- [ ] 图片 CDN 加速
- [ ] 虚拟滚动（当金句数量 > 1000）
- [ ] Service Worker 离线缓存
- [ ] 图片懒加载（Intersection Observer）

---

## 🔄 维护指南

### 定期任务
1. **更新 Token** - 建议 3 个月更换一次
2. **清理数据** - 定期删除被隐藏的金句
3. **备份数据** - 定期备份 `quotes.json`

### 监控
- 查看 Actions 执行记录
- 检查 Pages 部署状态
- 监控 Token 使用情况

---

## 🐛 已知问题

1. **上传后需要刷新**
   - 原因：GitHub API 异步处理
   - 解决：添加自动轮询检查更新

2. **Token 安全性**
   - 原因：嵌入在前端代码
   - 解决：考虑使用后端代理

3. **大图片上传慢**
   - 原因：Base64 编码后体积增大
   - 解决：进一步降低压缩质量或使用图床

---

## 🎯 未来计划

### 短期
- [ ] 添加图片分类/标签
- [ ] 支持评论功能
- [ ] 点赞功能
- [ ] 搜索功能

### 中期
- [ ] 后端代理服务（隐藏 Token）
- [ ] 用户系统（GitHub OAuth）
- [ ] 管理员后台
- [ ] 数据导出功能

### 长期
- [ ] 迁移到专用数据库
- [ ] 移动端 App
- [ ] 社交分享功能
- [ ] AI 内容审核

---

## 📚 参考资源

### 官方文档
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub REST API](https://docs.github.com/en/rest)

### 相关技术
- [Web APIs - FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Canvas API - 图片处理](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Bug
1. 描述问题
2. 提供截图
3. 浏览器和版本信息

### 功能建议
1. 说明需求场景
2. 提供设计思路
3. 相关技术方案

---

## 📄 开源协议

MIT License - 详见 LICENSE 文件

---

## 📧 联系方式

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)

---

**⭐ 喜欢这个项目？给个 Star 吧！**

最后更新：2025-10-23
