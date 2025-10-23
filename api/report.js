/**
 * Vercel Serverless Function - 举报金句
 * 使用 Vercel Postgres 更新举报数
 */

const { sql } = require('@vercel/postgres');

const REPORT_THRESHOLD = 3; // 举报阈值

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const { quoteId } = body;

    if (!quoteId) {
      return res.status(400).json({ error: '缺少金句ID' });
    }

    // 增加举报数,如果达到阈值则隐藏
    const result = await sql`
      UPDATE quotes
      SET 
        reports = reports + 1,
        hidden = CASE WHEN reports + 1 >= ${REPORT_THRESHOLD} THEN true ELSE hidden END
      WHERE id = ${quoteId}
      RETURNING id, reports, hidden
    `;

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '金句不存在' });
    }

    const updatedQuote = result.rows[0];

    return res.status(200).json({
      success: true,
      reports: updatedQuote.reports,
      hidden: updatedQuote.hidden,
      message: updatedQuote.hidden ? '举报次数已达阈值,已自动隐藏' : '举报成功'
    });

  } catch (error) {
    console.error('Report error:', error);
    
    if (error.message.includes('relation "quotes" does not exist')) {
      return res.status(500).json({
        error: '数据库未初始化',
        hint: '请先访问 /api/init-db (POST请求)初始化数据库'
      });
    }

    return res.status(500).json({
      error: '举报失败',
      details: error.message
    });
  }
}
