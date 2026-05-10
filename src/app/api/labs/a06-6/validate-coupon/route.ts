import { NextRequest, NextResponse } from "next/server";

const PROMOS: Record<string, { type: "percent" | "fixed", value: number }> = {
  "WELCOME20": { type: "percent", value: 20 },
  "LOYALTY15": { type: "fixed", value: 15 },
  "SPARK50": { type: "percent", value: 50 },
  "SAVE10": { type: "fixed", value: 10 },
  "EMPLOYEE50": { type: "percent", value: 50 },
  "REWARD30": { type: "percent", value: 30 },
};

/**
 * POST /api/labs/a06-6/validate-coupon
 * Validates a single coupon code.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = body.code?.toUpperCase().trim();

    if (!code || !PROMOS[code]) {
      return NextResponse.json({ valid: false, message: "Invalid or expired promo code." }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true, 
      code,
      details: PROMOS[code]
    });
  } catch (err) {
    return NextResponse.json({ error: "Validation system error." }, { status: 500 });
  }
}
