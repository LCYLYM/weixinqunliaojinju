#!/usr/bin/env node

/**
 * 同步 GitHub Issues 到 quotes.json
 * 监听带 "金句" 标签的 Issues，提取图片并同步到数据文件
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const QUOTES_FILE = path.join(process.cwd(), 'quotes.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY || 'LCYLYM/weixinqunliaojinju';

// GitHub API Helper
function githubAPI(endpoint, method = 'GET', body = null) {
    const [owner, repo] = REPO.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}${endpoint}`;
    
    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                'User-Agent': 'Quote-Wall-Bot',
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data || '{}'));
                } else {
                    reject(new Error(`API Error: ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

// 提取 Issue 中的图片
function extractImages(issueBody) {
    const imageRegex = /!\[.*?\]\((https:\/\/.*?)\)/g;
    const images = [];
    let match;
    
    while ((match = imageRegex.exec(issueBody)) !== null) {
        images.push(match[1]);
    }
    
    // 也匹配直接的图片链接
    const directImageRegex = /(https:\/\/user-images\.githubusercontent\.com\/.*?\.(png|jpg|jpeg|gif|webp))/gi;
    while ((match = directImageRegex.exec(issueBody)) !== null) {
        if (!images.includes(match[1])) {
            images.push(match[1]);
        }
    }
    
    return images;
}

// 主函数
async function main() {
    console.log('🔄 Starting quote sync from GitHub Issues...');
    
    // 读取现有数据
    let quotes = [];
    if (fs.existsSync(QUOTES_FILE)) {
        quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
    }
    
    // 获取所有带 "金句" 标签的开放 Issues
    const issues = await githubAPI('/issues?labels=金句&state=open&per_page=100');
    console.log(`📊 Found ${issues.length} open quote issues`);
    
    // 创建新的 quotes 数组（基于 Issues）
    const newQuotes = [];
    const existingIds = new Set(quotes.map(q => q.issueId));
    
    for (const issue of issues) {
        const images = extractImages(issue.body || '');
        
        if (images.length === 0) {
            console.log(`⚠️  Issue #${issue.number} has no images, skipping`);
            continue;
        }
        
        // 获取评论数（作为举报数）
        const comments = await githubAPI(`/issues/${issue.number}/comments`);
        const reportCount = comments.filter(c => 
            c.body && (c.body.includes('举报') || c.body.includes('report'))
        ).length;
        
        // 检查是否需要隐藏（举报超过3次或已关闭）
        const hidden = reportCount >= 3 || issue.state === 'closed';
        
        // 查找现有记录或创建新记录
        let quote = quotes.find(q => q.issueId === issue.number);
        
        if (!quote) {
            quote = {
                id: Date.now() + Math.random(),
                issueId: issue.number,
                issueUrl: issue.html_url,
                image: images[0], // 使用第一张图片
                timestamp: issue.created_at,
                reports: reportCount,
                hidden: hidden
            };
            console.log(`✅ New quote from issue #${issue.number}`);
        } else {
            // 更新现有记录
            quote.reports = reportCount;
            quote.hidden = hidden;
            quote.image = images[0]; // 更新图片（如果修改了）
            console.log(`🔄 Updated quote from issue #${issue.number}`);
        }
        
        newQuotes.push(quote);
    }
    
    // 按时间倒序排列
    newQuotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 写入文件
    fs.writeFileSync(QUOTES_FILE, JSON.stringify(newQuotes, null, 2));
    console.log(`💾 Saved ${newQuotes.length} quotes to ${QUOTES_FILE}`);
    console.log('✨ Sync complete!');
}

// 运行
main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
