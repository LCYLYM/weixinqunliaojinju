/**
 * 数据库初始化脚本
 * 在Vercel Postgres中创建quotes表
 */

const { ensureQuotesTable } = require('../lib/ensureTable');

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(503).json({
      error: '数据库连接未配置',
      hint: '请先在Vercel中配置POSTGRES_URL(使用Neon或其他Postgres服务)',
    });
  }

  try {
    await ensureQuotesTable();

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
