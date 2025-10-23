/**
 * Vercel Serverless Function - 处理金句图片上传
 * 使用 Vercel Postgres 存储图片(Base64)和元数据
 */

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
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

  try {
    const { image } = req.body;

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

    // 插入数据库
    const result = await sql`
      INSERT INTO quotes (image)
      VALUES (${image})
      RETURNING id, image, timestamp, reports, hidden
    `;

    const newQuote = result.rows[0];

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
    if (error.message.includes('relation "quotes" does not exist')) {
      return res.status(500).json({
        error: '数据库未初始化',
        hint: '请先访问 /api/init-db (POST请求)初始化数据库'
      });
    }

    return res.status(500).json({
      error: '上传失败',
      details: error.message
    });
  }
}
