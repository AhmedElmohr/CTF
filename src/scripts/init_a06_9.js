const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'ctf.db');
const db = new Database(dbPath);

const flag = "spark_ctf{tyP3_c0nfUs10n_m4ss_4ss1gnm3nt_m4st3r}";
const salt = process.env.FLAG_SALT || 'default_salt_if_missing';
const hash = crypto.createHash('sha256').update(salt + flag).digest('hex');

console.log("Calculated Hash for a06-9:", hash);

try {
    // Check if it exists first to avoid conflict
    const exists = db.prepare("SELECT 1 FROM challenges WHERE id = 'a06-9'").get();
    
    if (exists) {
        db.prepare("UPDATE challenges SET flag_hash = ? WHERE id = 'a06-9'").run(hash);
        console.log("Updated existing a06-9 challenge hash.");
    } else {
        db.prepare(`
            INSERT INTO challenges (id, name, category, difficulty, points, goal, cwe, flag_hash) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'a06-9', 
            'Workspace Invitation Bypass', 
            'Business Logic', 
            'Hard', 
            600, 
            'Exploit data binding type confusion to access administration workspace and capture the flag.', 
            'CWE-843', 
            hash
        );
        console.log("Inserted new a06-9 challenge into the database.");
    }
} catch (err) {
    console.error("Database execution error:", err.message);
}
