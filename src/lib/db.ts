import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ctf.db');
const db = new Database(dbPath);

// Initialize tables if they don't exist
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    points INTEGER NOT NULL,
    goal TEXT NOT NULL,
    cwe TEXT NOT NULL,
    flag_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    solved_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    points INTEGER NOT NULL,
    UNIQUE(challenge_id, user_id),
    FOREIGN KEY(challenge_id) REFERENCES challenges(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export default db;
