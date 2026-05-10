const Database = require('better-sqlite3');
const path = require('path');

const db = new Database('ctf.db');

const row = db.prepare("SELECT flag FROM challenges WHERE id = 'a06-8'").get();
console.log("Current Flag in DB:", row ? row.flag : "NOT FOUND");

if (row && row.flag !== "flag{th3_ultim4t3_f1n4nc1al_h31st_2026}") {
    console.log("Fixing flag mismatch...");
    db.prepare("UPDATE challenges SET flag = ? WHERE id = 'a06-8'").run("flag{th3_ultim4t3_f1n4nc1al_h31st_2026}");
    console.log("Flag updated successfully.");
}
