import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { Challenge } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeId, flag } = body;

    if (!challengeId || !flag) {
      return NextResponse.json(
        { correct: false, message: 'Challenge ID and flag are required' },
        { status: 400 }
      );
    }

    // Basic rate limiting using IP address
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, challengeId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          correct: false, 
          message: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.` 
        },
        { status: 429 }
      );
    }

    // Fetch challenge from DB
    const stmt = db.prepare('SELECT id, points, flag_hash FROM challenges WHERE id = ?');
    const challenge = stmt.get(challengeId) as { id: string; points: number; flag_hash: string } | undefined;

    if (!challenge) {
      return NextResponse.json(
        { correct: false, message: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Hash the submitted flag
    const salt = process.env.FLAG_SALT || 'default_salt_if_missing';
    const submittedHash = crypto.createHash('sha256').update(salt + flag).digest('hex');

    // Prevent timing attacks by comparing hashes in constant time
    const bufferSubmitted = Buffer.from(submittedHash, 'hex');
    const bufferStored = Buffer.from(challenge.flag_hash, 'hex');

    let isCorrect = false;
    try {
      // Must have same length for timingSafeEqual
      if (bufferSubmitted.length === bufferStored.length) {
        isCorrect = crypto.timingSafeEqual(bufferSubmitted, bufferStored);
      }
    } catch (e) {
      isCorrect = false;
    }

    if (isCorrect) {
      // In a real app, we would record the submission in the DB here for the user
      // For this MVP, the frontend handles local state.
      // E.g., db.prepare('INSERT INTO submissions ...').run();

      return NextResponse.json({
        correct: true,
        points: challenge.points,
        message: 'Flag is correct!'
      });
    }

    return NextResponse.json(
      { correct: false, message: 'Incorrect flag' },
      { status: 400 } // Keep it simple, 400 for incorrect
    );

  } catch (error) {
    console.error('Flag submission error:', error);
    return NextResponse.json(
      { correct: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
