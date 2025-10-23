# 📱 微信群聊金句墙 - 纯Vercel版

> 🚀 **完全脱离GitHub!使用Vercel Postgres存储所有数据**  
> 用户无需登录,一键部署,零配置!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LCYLYM/weixinqunliaojinju)

---

## ✨ 核心特性

- ✅ **完全匿名上传** - 用户无需任何登录
- ✅ **零配置部署** - 无需任何环境变量或Token
- ✅ **Vercel Postgres** - 免费256MB数据库存储
- ✅ **Base64图片存储** - 图片直接存数据库
- ✅ **Claude风格UI** - 优雅的交互动画
- ✅ **自动举报机制** - 3次举报自动隐藏
- ✅ **纯Serverless** - 完全不依赖GitHub
- ©️ **生🐟** - 用心制作

---

## 🎯 技术架构

```
用户浏览器
    ↓
Vercel前端 (public/index.html)
    ↓
Vercel Serverless Functions (api/*.js)
    ↓
Vercel Postgres 数据库
    ↓
存储: 图片(Base64) + 元数据(JSON)
```

**核心优势**: 
- 🚫 无需GitHub账号
- 🚫 无需配置Token
- 🚫 无需环境变量
- ✅ 点击Deploy按钮即可!

---

## 📦 一键部署(推荐)

### 方法1: Vercel一键部署

1. **点击Deploy按钮**:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LCYLYM/weixinqunliaojinju)

2. **登录Vercel账号** (如果没有,免费注册)

3. **导入仓库**: 
   - Vercel会自动Fork仓库到你的GitHub
   - 或者直接从GitHub导入

4. **点击Deploy**: 
   - 无需配置任何环境变量!
   - 等待2-3分钟部署完成

5. **创建Postgres数据库**:
   - 部署完成后,进入项目Dashboard
   - 点击 **Storage** 标签
   - 点击 **Create Database**
   - 选择 **Postgres**
   - 选择区域(建议选离你近的)
   - 点击 **Create** (免费版256MB)

6. **初始化数据库**:
   - 部署完成后,访问: `https://你的域名.vercel.app/api/init-db`
   - 使用POST请求(可以用浏览器扩展或curl):
   ```bash
   curl -X POST https://你的域名.vercel.app/api/init-db
   ```
   - 或者用这个在线工具: https://reqbin.com/

7. **完成!** 访问你的网站开始使用!

---

## 🛠️ 本地开发(可选)

### 安装依赖
```bash
npm install
```

### 连接Vercel Postgres
```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 关联项目
vercel link

# 4. 拉取环境变量(Postgres连接信息)
vercel env pull .env.local

# 5. 启动本地开发
npm run dev
```

### 初始化本地数据库
```bash
curl -X POST http://localhost:3000/api/init-db
```

---

## 📁 项目结构

```
weixinqunliaojinju/
├── api/                    # Vercel Serverless Functions
│   ├── init-db.js         # 数据库初始化(首次运行)
│   ├── upload.js          # 图片上传(存Postgres)
│   ├── quotes.js          # 获取金句列表
│   └── report.js          # 举报功能
├── public/                # 静态前端
│   └── index.html         # Claude风格主页
├── package.json           # 项目依赖
├── vercel.json            # Vercel配置
└── README.md              # 本文档
```

---

## 🗄️ 数据库Schema

```sql
CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,              -- 自增ID
  image TEXT NOT NULL,                   -- Base64图片数据
  timestamp TIMESTAMPTZ DEFAULT NOW(),   -- 上传时间
  reports INTEGER DEFAULT 0,             -- 举报次数
  hidden BOOLEAN DEFAULT FALSE,          -- 是否隐藏
  created_at TIMESTAMPTZ DEFAULT NOW()   -- 创建时间
);

-- 索引优化
CREATE INDEX idx_quotes_hidden ON quotes(hidden);
CREATE INDEX idx_quotes_timestamp ON quotes(timestamp DESC);
```

---

## 🔧 API接口

### 1. 初始化数据库(仅需一次)
```http
POST /api/init-db
```

### 2. 上传金句
```http
POST /api/upload
Content-Type: application/json

{
  "image": "data:image/png;base64,iVBORw0KG..."
}
```

**限制**: Base64数据不超过2MB(约1.5MB原图)

### 3. 获取金句列表
```http
GET /api/quotes
```

### 4. 举报金句
```http
POST /api/report
Content-Type: application/json

{
  "quoteId": "123"
}
```

---

## 🎨 自定义配置

### 修改举报阈值
编辑 `api/report.js`:
```javascript
const REPORT_THRESHOLD = 3;  // 改为你想要的数字
```

### 修改图片大小限制
编辑 `api/upload.js`:
```javascript
if (image.length > 2 * 1024 * 1024) {  // 2MB限制
  // 修改这里
}
```

### 自定义样式
编辑 `public/index.html` 中的CSS变量:
```css
:root {
    --color-primary: #C96442;
    --color-background: #FAF9F5;
}
```

---

## 💡 Vercel Postgres免费额度

| 项目 | 免费版 | 说明 |
|------|--------|------|
| 存储空间 | 256 MB | 约可存储200-500张压缩图片 |
| 查询次数 | 无限 | 完全够用 |
| 连接数 | 60个 | 并发访问足够 |
| 价格 | $0/月 | 完全免费 |

**优化建议**:
- 前端压缩图片(建议500KB以内)
- 定期清理旧金句(可加定时任务)
- 超出后可升级到Pro版($20/月)

---

## 🐛 常见问题

### Q1: 部署后访问报错?
**A**: 先访问 `/api/init-db` (POST)初始化数据库

### Q2: 如何初始化数据库?
**A**: 方法1 - 用curl:
```bash
curl -X POST https://你的域名.vercel.app/api/init-db
```
方法2 - 用在线工具: https://reqbin.com/

### Q3: 图片上传失败?
**A**: 检查图片大小,Base64不能超过2MB。建议前端压缩。

### Q4: 如何查看数据库?
**A**: 
1. 进入Vercel项目Dashboard
2. 点击 Storage → Postgres
3. 点击 Query 标签可执行SQL

### Q5: 存储空间不够怎么办?
**A**: 
- 前端强制压缩图片
- 定期清理旧数据
- 升级到Pro版($20/月, 512GB)

### Q6: 如何备份数据?
**A**: 在Postgres Query中执行:
```sql
SELECT * FROM quotes;
```
导出为CSV或JSON

---

## 📊 性能优化

1. **前端图片压缩**: 
```javascript
// 可集成browser-image-compression库
import imageCompression from 'browser-image-compression';

const compressed = await imageCompression(file, {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920
});
```

2. **数据库索引**: 已创建(hidden + timestamp)

3. **懒加载**: 已实现 `loading="lazy"`

4. **分页查询**: 当前限制100条,可改为分页

---

## 🔒 安全说明

- ✅ **无凭据暴露** - 不使用任何Token或密码
- ✅ **CORS配置** - API已配置跨域
- ✅ **SQL注入防护** - 使用@vercel/postgres参数化查询
- ✅ **文件大小限制** - 2MB Base64限制
- ✅ **自动审核** - 3次举报自动隐藏

---

## 📝 版本历史

### v3.0.0 (2025-10-23) ⭐ 最新
- 🎉 **完全重构**: 纯Vercel方案
- 🗄️ 使用Vercel Postgres存储
- 🚫 移除所有GitHub依赖
- ⚡ 零配置一键部署
- 📱 优化移动端体验

### v2.0.0 (2025-10-23)
- 改用GitHub Issues

### v1.0.0 (2025-10-22)
- 初始版本

---

## 💰 成本对比

| 方案 | 成本 | 存储 | 流量 | 维护 |
|------|------|------|------|------|
| **纯Vercel** | $0/月 | 256MB | 100GB/月 | 零维护 |
| GitHub Pages | $0/月 | 无限 | 100GB/月 | 需配置 |
| 自建服务器 | $5+/月 | 看配置 | 看配置 | 高 |

---

## 💖 鸣谢

- [Vercel](https://vercel.com) - 免费Serverless+Postgres
- [Lottiefiles](https://lottiefiles.com) - 动画资源
- [Claude](https://claude.ai) - UI设计灵感

---

## 👨‍💻 作者

**©️生🐟**

如有问题,欢迎提Issue! 🚀

---

## 📄 开源协议

MIT License

---

<div align="center">

**©️ 生🐟 · 2025**

Powered by Vercel · 完全免费 · 永久运行

[立即部署](https://vercel.com/new/clone?repository-url=https://github.com/LCYLYM/weixinqunliaojinju) · [提交问题](../../issues) · [⭐ 给个Star](../../stargazers)

---

**🚀 点击上方Deploy按钮,3分钟搞定!**

</div>
