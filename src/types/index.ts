export interface Challenge {
  id: string;
  name: string;
  category: 'A02:2025' | 'A06:2025';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  points: number;
  goal: string;
  cwe: string[];
  flagHash: string; // Stored hashed value for the flag (e.g. SHA-256)
  description?: string; // Long form description for the modal
}

export interface FlagSubmission {
  challengeId: string;
  flag: string;
}

export interface SubmissionResponse {
  correct: boolean;
  points?: number;
  message: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  solvedCount: number;
}
