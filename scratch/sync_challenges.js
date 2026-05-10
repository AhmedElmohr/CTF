const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'ctf.db');
const db = new Database(dbPath);

const challenges = [
  {
    id: "a06-7",
    name: "Advanced Price Manipulation",
    category: "A06:2025",
    difficulty: "Hard",
    points: 400,
    goal: "Tamper with client-side price parameters in a luxury car dealership to purchase a high-end vehicle for a fraction of the cost.",
    cwe: "CWE-501, CWE-602",
    flag: "flag{spark_luxury_h4ck_99x}"
  }
];

const salt = process.env.FLAG_SALT || 'default_salt_if_missing';

const upsert = db.prepare(`
  INSERT INTO challenges (id, name, category, difficulty, points, goal, cwe, flag_hash)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name,
    category=excluded.category,
    difficulty=excluded.difficulty,
    points=excluded.points,
    goal=excluded.goal,
    cwe=excluded.cwe,
    flag_hash=excluded.flag_hash
`);

for (const c of challenges) {
  const hash = crypto.createHash('sha256').update(salt + c.flag).digest('hex');
  upsert.run(c.id, c.name, c.category, c.difficulty, c.points, c.goal, c.cwe, hash);
  console.log(`Synced challenge: ${c.id}`);
}

db.close();
