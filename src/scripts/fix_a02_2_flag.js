const Database = require('better-sqlite3');
const db = new Database('data/ctf.db');
const info = db.prepare("UPDATE challenges SET flag_hash = 'ee68b9a05e7e2fd8eaef9b34788e1786ae4f652e8a006700ab776f6776065133' WHERE id = 'a02-2'").run();
console.log('Rows updated:', info.changes);
