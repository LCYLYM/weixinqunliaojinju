/**
 * Admin endpoint: list all quotes.
 */

const { sql } = require('@vercel/postgres');
const { ensureQuotesTable } = require('../../lib/ensureTable');

const ADMIN_PASSWORD = 'lcy';

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('请求体不是有效的JSON');
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
      hint: '请先在Vercel项目中配置 Postgres 连接信息',
    });
  }

  try {
    const body = await parseJsonBody(req);
    if (body.password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: '管理员密码错误' });
    }

    await ensureQuotesTable();

    const result = await sql`
      SELECT id, image, timestamp, reports, hidden
      FROM quotes
      ORDER BY timestamp DESC
    `;

    const quotes = result.rows.map((row) => ({
      id: Number(row.id),
      image: row.image,
      timestamp: row.timestamp,
      reports: row.reports,
      hidden: row.hidden,
    }));

    return res.status(200).json({ success: true, quotes });
  } catch (error) {
    console.error('Admin list error:', error);
    const message = error.message || '未知错误';
    return res.status(500).json({ error: '获取失败', details: message });
  }
};
