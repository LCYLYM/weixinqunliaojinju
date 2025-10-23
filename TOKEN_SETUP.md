# 🔐 GitHub Fine-grained Token 配置指南

## 为什么使用 Fine-grained Token？

Fine-grained Personal Access Token（细粒度令牌）是 GitHub 提供的最安全的访问方式：

✅ **只授权单个仓库** - 仅限 `LCYLYM/weixinqunliaojinju`  
✅ **最小权限原则** - 只授予必要的 Contents 和 Workflows 权限  
✅ **可设置过期时间** - 定期更换提高安全性  
✅ **可随时撤销** - 发现问题立即撤销  
✅ **一次配置，所有人使用** - 无需每个用户授权  

---

## 📋 创建步骤

### 第一步：访问 GitHub 设置

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单滚动到底部 → **Developer settings**
4. 选择 **Personal access tokens** → **Fine-grained tokens**
5. 点击 **Generate new token**

---

### 第二步：配置 Token 基本信息

| 字段 | 填写内容 |
|------|----------|
| **Token name** | `weixinqunliaojinju-token` |
| **Description** | `微信金句分享墙专用 Token` |
| **Expiration** | 建议选择 `90 days`（3个月后更换） |
| **Resource owner** | 选择你的账号 `LCYLYM` |

---

### 第三步：选择仓库范围

⚠️ **重要**：必须选择 **Only select repositories**

然后在下拉菜单中选择：
```
LCYLYM/weixinqunliaojinju
```

✅ 这样 Token 只能访问这一个仓库，不会影响你的其他仓库！

---

### 第四步：配置权限（最小化原则）

在 **Repository permissions** 部分，只需要开启以下两项：

#### 1. Contents（内容）
- **权限级别**：`Read and write`
- **用途**：读取和更新 `quotes.json` 文件

#### 2. Workflows（工作流）
- **权限级别**：`Read and write`
- **用途**：触发 `update-quotes.yml` 工作流

⚠️ **其他权限全部不要勾选！**

---

### 第五步：生成并保存 Token

1. 检查配置无误后，点击页面底部的 **Generate token**
2. ⚠️ **立即复制 Token**（格式：`github_pat_xxxxxxxxxxxxxxxxxxxxxx`）
3. Token 只显示一次，请妥善保存！

---

### 第六步：配置到项目中

1. 打开 `index.html` 文件
2. 找到第 280 行左右的配置：

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'github_pat_YOUR_TOKEN_HERE',  // 👈 替换这里
    REPO_OWNER: 'LCYLYM',
    REPO_NAME: 'weixinqunliaojinju',
    BRANCH: 'main',
    WORKFLOW_FILE: 'update-quotes.yml'
};
```

3. 将 `'github_pat_YOUR_TOKEN_HERE'` 替换为你复制的 Token：

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'github_pat_11ABCDEFG1234567890abcdefghijklmnopqrstuv',  // 👈 粘贴你的 Token
    REPO_OWNER: 'LCYLYM',
    REPO_NAME: 'weixinqunliaojinju',
    BRANCH: 'main',
    WORKFLOW_FILE: 'update-quotes.yml'
};
```

4. 保存文件并提交：

```bash
git add index.html
git commit -m "配置 Fine-grained Token"
git push
```

---

## ✅ 验证配置

访问你的网站：
```
https://lcylym.github.io/weixinqunliaojinju/
```

测试上传一张图片：
- 如果成功提交并显示"上传成功！正在更新..."，说明配置正确
- 如果提示"管理员尚未配置 GitHub Token"，说明 Token 没有正确替换

---

## 🔄 更新 Token（3个月后）

Token 过期后需要重新生成：

1. 访问 [Personal access tokens](https://github.com/settings/tokens?type=beta)
2. 找到 `weixinqunliaojinju-token`
3. 点击 **Regenerate token**
4. 重新复制新的 Token
5. 更新 `index.html` 中的 `GITHUB_TOKEN`
6. 提交并推送

---

## 🚨 安全注意事项

### ⚠️ Token 已经公开怎么办？

如果 Token 被泄露或公开：

1. **立即撤销**
   - 访问 [Tokens 页面](https://github.com/settings/tokens?type=beta)
   - 找到对应 Token，点击 **Delete**

2. **重新生成**
   - 按照上述步骤重新创建一个新 Token
   - 更新到代码中

### 🛡️ 降低风险的方法

虽然 Token 嵌入在前端代码中，但由于权限已经最小化，风险可控：

✅ **只能操作一个仓库** - 不会影响其他项目  
✅ **只能触发 Workflow** - 无法直接修改代码  
✅ **可随时撤销** - 发现异常立即停用  
✅ **有过期时间** - 3个月后自动失效  

### 📊 监控使用情况

定期检查：
1. [Actions 执行记录](https://github.com/LCYLYM/weixinqunliaojinju/actions)
2. [commits 历史](https://github.com/LCYLYM/weixinqunliaojinju/commits/main)

如发现异常活动，立即撤销 Token。

---

## 🎯 权限对比表

| Token 类型 | 作用范围 | 权限粒度 | 推荐度 |
|-----------|---------|---------|-------|
| **Classic Token** | 所有仓库或所有公开仓库 | 粗粒度 | ❌ 不推荐 |
| **Fine-grained Token** | 指定单个仓库 | 细粒度 | ✅ 强烈推荐 |
| **OAuth App** | 用户授权，每人不同 | 用户级别 | ⚠️ 不适合本项目 |

---

## ❓ 常见问题

### Q1: Token 嵌入前端代码安全吗？

**A**: 相对安全，因为：
- 权限已限制到最小（只能操作一个仓库的两个权限）
- 即使被滥用，也只是触发 Workflow，不会造成严重后果
- 可以随时撤销并重新生成

### Q2: 能否避免 Token 公开？

**A**: 纯前端项目无法完全避免，但可以考虑：
- 使用 Cloudflare Workers / Vercel Functions 代理
- 添加简单的验证码机制
- 但这些都会增加复杂度

当前方案已经是**纯前端部署的最优解**。

### Q3: Token 过期后网站会停止工作吗？

**A**: 是的，需要重新生成并更新。建议：
- 设置日历提醒（Token 过期前一周）
- 记录 Token 创建日期

---

## 📚 相关文档

- [GitHub Fine-grained PAT 官方文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
- [GitHub Actions 触发文档](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)

---

**配置完成后，一个人授权，所有人都能用！🎉**
