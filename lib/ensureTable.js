/**
 * Shared helper to ensure the `quotes` table exists in Postgres.
 */

const { sql } = require('@vercel/postgres');

async function ensureQuotesTable() {
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

  await sql`
    CREATE INDEX IF NOT EXISTS idx_quotes_hidden ON quotes(hidden)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_quotes_timestamp ON quotes(timestamp DESC)
  `;
}

module.exports = {
  ensureQuotesTable,
};
