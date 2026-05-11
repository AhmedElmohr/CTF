import { NextRequest, NextResponse } from "next/server";

const FLAG = "flag{spark_st0r4ge_l34k_v2}";

const fileContents: Record<string, string> = {
  "SYSTEM_ACCESS.txt": `# SPARK INFRASTRUCTURE - INTERNAL ACCESS ONLY
# Last security audit: 2026-05-08

GATEWAY_USER: spark_admin
PASS_HASH: $argon2id$v=19$m=65536,t=3,p=4...
SYSTEM_FLAG: flag{spark_st0r4ge_l34k_v2}

[CONFIDENTIAL] Keep this information within the DevOps team.`,
  "internal_api_keys.env": `# PRODUCTION ENVIRONMENT KEYS
STRIPE_LIVE_KEY=sk_live_51Mz...
AWS_SECRET_ACCESS_KEY=AKIA...
SPARK_INTERNAL_TOKEN=exp_73829103847291`,
  "production_db_dump.sql.gz": `[BINARY DATA STREAM]
-- SparkCloud Production Database Export
-- Version 4.2.1
-- Tables: users, orders, transactions, inventory...
-- (File truncated for preview, download full 125MB for analysis)`,
  "robots.txt": `User-agent: *
Disallow: /assets/backup/
Disallow: /internal/
Disallow: /api/v1/auth/`,
};

/**
 * GET /api/labs/a02-2/files/download?file=credentials.txt
 *
 * File download endpoint for the directory listing lab.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "Missing 'file' query parameter." },
      { status: 400 }
    );
  }

  const content = fileContents[file];

  if (!content) {
    return NextResponse.json(
      { error: `File not found: ${file}` },
      { status: 404 }
    );
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}
