-- SBFC Organization — D1 database schema
-- Matches every table/column used by index.js (the Cloudflare Worker).
-- Apply with:  npx wrangler d1 execute sbfc --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  admin_id INTEGER,
  username TEXT,
  role TEXT,
  created_at INTEGER,
  last_seen INTEGER,
  expires_at INTEGER
);

CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  amount REAL NOT NULL,
  payment_method TEXT,
  tr_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT,
  message TEXT
);

CREATE TABLE IF NOT EXISTS visitor_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS visitor_online (
  visitor_id TEXT PRIMARY KEY,
  last_seen TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sbfc_members (
  member_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS sbfc_saving (
  entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  member_id TEXT,
  full_name TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  remark TEXT
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT
);

-- Seed the first administrator. CHANGE THIS PASSWORD before going live
-- (the Worker compares passwords in plain text).
INSERT OR IGNORE INTO admins (username, password, role, created_at)
VALUES ('admin', 'admin123', 'admin', CAST(strftime('%s','now') AS INTEGER));
