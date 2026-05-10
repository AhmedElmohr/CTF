# OWASP CTF Platform 2025

A modern, hacker-themed Capture The Flag platform built with Next.js 16, TailwindCSS v4, and SQLite. This platform features **11 interactive labs** covering OWASP Top 10 2025 vulnerabilities, specifically focusing on **A02:2025 Security Misconfiguration** and **A06:2025 Insecure Design**. Each lab includes simulated penetration testing tools like Network Interceptors and Proxy tools.

## Tech Stack
- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** TailwindCSS v4 with custom glitch and typing animations
- **Database:** SQLite (via `better-sqlite3`)
- **Security:** In-memory rate limiting, server-side flag validation with `crypto.timingSafeEqual`

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Copy the example environment file and configure your variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Make sure to set a secure `FLAG_SALT` in your `.env.local` file. This salt is used to hash flags before storing them in the database.

### 3. Seed the Database
Before running the application, you must populate the SQLite database with the challenges and hashed flags:
\`\`\`bash
npx tsx scripts/seed.ts
\`\`\`
This will create a `data/ctf.db` file containing the challenges. The raw flag values are **only** visible in `scripts/seed.ts` and are stored as SHA-256 hashes in the database.

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser to see the platform.

## Adding New Challenges

To add new challenges:
1. Open `src/lib/challenges.ts` and add a new object to the `initialChallenges` array.
2. Open `scripts/seed.ts` and add the corresponding flag to the `flags` record using the new challenge's `id`.
3. Re-run the seed script:
   \`\`\`bash
   npx tsx scripts/seed.ts
   \`\`\`

## Security Notes
- **Flag Storage:** Flag values are NEVER sent to the frontend bundle. They are strictly validated on the server via the `/api/submit-flag` endpoint.
- **Timing Attacks:** Flag validation uses `crypto.timingSafeEqual` to prevent timing-based extraction of flags.
- **Brute Forcing:** The submission endpoint includes an IP-based rate limiter (max 5 attempts per minute per challenge).
