import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Fetch top 10 users ordered by points
    const stmt = db.prepare(`
      SELECT username, total_points as points, solved_count as solvedCount
      FROM users
      ORDER BY total_points DESC
      LIMIT 10
    `);
    
    const users = stmt.all();

    // Map to add rank (handled by index on frontend, or we can add it here)
    const leaderboard = users.map((u: any, index: number) => ({
      rank: index + 1,
      ...u
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
