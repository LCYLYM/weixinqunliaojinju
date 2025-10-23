/**
 * Vercel Serverless Function - 处理金句图片上传
 * 使用 Vercel Postgres 存储图片(Base64)和元数据
 */

const { sql } = require('@vercel/postgres');
const { ensureQuotesTable } = require('../lib/ensureTable');

module.exports = async function handler(req, res) {
  // 设置CORS允许前端访问
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(503).json({
      error: '数据库连接未配置',
      hint: '请在Vercel中创建Postgres数据库,并确保环境变量POSTGRES_URL已自动注入'
    });
  }

  try {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      if (!body || Object.keys(body).length === 0) {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawBody = Buffer.concat(buffers).toString();
        body = rawBody ? JSON.parse(rawBody) : {};
      }
    } catch (parseError) {
      return res.status(400).json({ error: '请求体不是有效的JSON' });
    }

    const { image } = body;

    if (!image) {
      return res.status(400).json({ error: '缺少图片数据' });
    }

    // 验证Base64格式
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ error: '无效的图片格式' });
    }

    // 压缩检查(限制2MB Base64数据)
    if (image.length > 2 * 1024 * 1024) {
      return res.status(400).json({ error: '图片过大,请压缩后上传(限制1.5MB)' });
    }

    const insertQuote = async () => {
      const result = await sql`
        INSERT INTO quotes (image)
        VALUES (${image})
        RETURNING id, image, timestamp, reports, hidden
      `;
      return result.rows[0];
    };

    let newQuote;
    try {
      newQuote = await insertQuote();
    } catch (dbError) {
      if (dbError?.message?.includes('relation "quotes" does not exist')) {
        await ensureQuotesTable();
        newQuote = await insertQuote();
      } else {
        throw dbError;
      }
    }

    return res.status(200).json({
      success: true,
      quote: {
        id: newQuote.id.toString(),
        image: newQuote.image,
        timestamp: newQuote.timestamp,
        reports: newQuote.reports,
        hidden: newQuote.hidden
      },
      message: '金句上传成功! 🎉'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // 如果是表不存在错误
    return res.status(500).json({
      error: '上传失败',
      details: error.message
    });
  }
}
