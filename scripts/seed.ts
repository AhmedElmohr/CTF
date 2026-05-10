import 'dotenv/config';
import crypto from 'crypto';
import db from '../src/lib/db';
import { initialChallenges } from '../src/lib/challenges';

// In a real scenario, these flags would be securely generated and injected.
// We map them here by challenge ID for the seed script.
const flags: Record<string, string> = {
  "a02-1": "flag{d3f4u1t_cr3ds_r_b4d}",
  "a02-2": "flag{d1r_l1st1ng_3xp0s3d_m3}",
  "a02-3": "flag{st4ck_tr4c3_1nt3l}",
  "a02-4": "flag{h34d3rs_m1ss1ng_0uch}",
  "a02-5": "flag{h4rdc0d3d_s3cr3t5_pwn3d}",
  "a06-1": "flag{r3c0v3ry_l0g1c_OSINT_fl4w}",
  "a06-2": "flag{trus7_n0_cl13nt_d4t4}",
  "a06-3": "flag{r4c3_t0_th3_f1n1sh_l1n3}",
  "a06-4": "flag{pr1v_3sc_v1a_1d0r}",
  "a06-5": "flag{w0rkfl0w_by_p4ss3d_3z}",
  "a06-6": "flag{c0up0n_st4ck1ng_l0g1c_br34k}",
  "a06-7": "flag{luxur10u5_pr1c3_t4mp3r1ng}"
};

const salt = process.env.FLAG_SALT || 'default_salt_if_missing';

console.log('Seeding Database...');

const insert = db.prepare(`
  INSERT INTO challenges (id, name, category, difficulty, points, goal, cwe, flag_hash)
  VALUES (@id, @name, @category, @difficulty, @points, @goal, @cwe, @flag_hash)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    category = excluded.category,
    difficulty = excluded.difficulty,
    points = excluded.points,
    goal = excluded.goal,
    cwe = excluded.cwe,
    flag_hash = excluded.flag_hash
`);

const insertMany = db.transaction((challenges) => {
  for (const challenge of challenges) {
    insert.run(challenge);
  }
});

const challengesToInsert = initialChallenges.map(c => {
  const flag = flags[c.id];
  if (!flag) throw new Error(`Missing flag for challenge ${c.id}`);

  const flagHash = crypto.createHash('sha256').update(salt + flag).digest('hex');

  return {
    id: c.id,
    name: c.name,
    category: c.category,
    difficulty: c.difficulty,
    points: c.points,
    goal: c.goal,
    cwe: JSON.stringify(c.cwe), // Store as JSON string in SQLite
    flag_hash: flagHash
  };
});

try {
  insertMany(challengesToInsert);
  console.log(`Successfully seeded ${challengesToInsert.length} challenges.`);
} catch (error) {
  console.error('Error seeding database:', error);
}

// Add a dummy user for testing leaderboard
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, total_points, solved_count)
  VALUES ('u1', 'spark_hacker', 500, 2)
`);
insertUser.run();
console.log('Database seed complete.');
