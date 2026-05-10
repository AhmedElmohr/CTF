const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'ctf.db');
const db = new Database(dbPath);

const flag = "flag{th3_ultim4t3_f1n4nc1al_h31st_2026}";
const salt = 'default_salt_if_missing';
const hash = crypto.createHash('sha256').update(salt + flag).digest('hex');

console.log("Calculated Hash:", hash);

try {
    const info = db.prepare("UPDATE challenges SET flag_hash = ? WHERE id = 'a06-8'").run(hash);
    if (info.changes > 0) {
        console.log("Flag hash updated successfully for a06-8.");
    } else {
        // If it doesn't exist, insert it
        db.prepare(`INSERT INTO challenges (id, name, category, difficulty, points, goal, cwe, flag_hash) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
            'a06-8', 
            'The Grand Financial Exploit', 
            'Business Logic', 
            'Hard', 
            500, 
            'Reach $1M net worth and capture the admin flag.', 
            'CWE-840', 
            hash
        );
        console.log("Challenge a06-8 registered with correct flag hash.");
    }
} catch (err) {
    console.error("Database error:", err.message);
}
