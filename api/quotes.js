/**
 * Vercel Serverless Function - 获取金句列表
 * 从 Vercel Postgres 读取数据
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  // CORS设置
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(503).json({
      error: '数据库连接未配置',
      hint: '请在Vercel中创建Postgres数据库,并确保环境变量POSTGRES_URL已自动注入'
    });
  }

  try {
    // 查询所有未隐藏的金句,按时间倒序
    const result = await sql`
      SELECT id, image, timestamp, reports, hidden
      FROM quotes
      WHERE hidden = false
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    const quotes = result.rows.map(row => ({
      id: row.id.toString(),
      image: row.image,
      timestamp: row.timestamp,
      reports: row.reports,
      hidden: row.hidden
    }));

    return res.status(200).json({
      success: true,
      quotes: quotes,
      total: quotes.length
    });

  } catch (error) {
    console.error('Fetch quotes error:', error);
    
    // 如果是表不存在错误
  if (error?.message?.includes('relation "quotes" does not exist')) {
      return res.status(500).json({
        error: '数据库未初始化',
        hint: '请先访问 /api/init-db (POST请求)初始化数据库',
        quotes: [],
        total: 0
      });
    }

    return res.status(500).json({
      error: '获取金句失败',
      details: error.message
    });
  }
}
