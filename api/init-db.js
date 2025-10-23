/**
 * 数据库初始化脚本
 * 在Vercel Postgres中创建quotes表
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 创建quotes表
    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id BIGSERIAL PRIMARY KEY,
        image TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        reports INTEGER DEFAULT 0,
        hidden BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_hidden ON quotes(hidden);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_timestamp ON quotes(timestamp DESC);
    `;

    return res.status(200).json({
      success: true,
      message: '数据库初始化成功! 表已创建'
    });

  } catch (error) {
    console.error('Database init error:', error);
    return res.status(500).json({
      error: '数据库初始化失败',
      details: error.message
    });
  }
}
