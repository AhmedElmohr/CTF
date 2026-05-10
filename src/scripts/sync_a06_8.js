const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ctf.db');
const db = new sqlite3.Database(dbPath);

const challenge = {
  id: "a06-8",
  name: "The Grand Financial Exploit",
  category: "A06:2025",
  difficulty: "Insane",
  points: 1000,
  flag: "flag{th3_ultim4t3_f1n4nc1al_h31st_2026}"
};

db.serialize(() => {
  db.run(`INSERT OR REPLACE INTO challenges (id, name, category, difficulty, points, flag) 
          VALUES (?, ?, ?, ?, ?, ?)`, 
          [challenge.id, challenge.name, challenge.category, challenge.difficulty, challenge.points, challenge.flag], 
          (err) => {
    if (err) {
      console.error("Error inserting challenge:", err.message);
    } else {
      console.log(`Challenge ${challenge.id} registered successfully.`);
    }
  });
});

db.close();
