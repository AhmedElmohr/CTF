const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ctf.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create bank accounts table for a06-8
  db.run(`CREATE TABLE IF NOT EXISTS lab_a06_8_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    account_number TEXT UNIQUE,
    egp_balance REAL DEFAULT 2500.0,
    usd_balance REAL DEFAULT 10.0,
    spc_balance REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log("Bank database table for a06-8 created successfully.");
});

db.close();
