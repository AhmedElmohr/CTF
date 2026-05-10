import { NextRequest } from "next/server";
import { bankDb } from "@/lib/bank-db";
import { getOrCreateSessionId, jsonWithSession } from "../../_lib/sessions";

const FLAG = "flag{th3_ultim4t3_f1n4nc1al_h31st_2026}";

export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  try {
    const body = await request.json();
    const { userId, amount, fromCurrency, toAccount, action } = body;

    if (action === "TRANSFER") {
        const { targetCurrency } = body; 
        // Vulnerability: Blind trust. We use targetCurrency (sent by user) 
        // to decide what to add to the recipient, while deducting 'amount' 
        // from fromCurrency.
        const currencyToAdd = targetCurrency || fromCurrency;
        
        await bankDb.transfer(body.email, toAccount, amount, fromCurrency, currencyToAdd);
        const updatedUser = await bankDb.getUserByEmail(body.email);
        return jsonWithSession({ success: true, user: updatedUser, message: "Transaction executed successfully!" }, sessionId, isNew);
    }

    // Direct Balance Update (for internal wallet movements EGP -> USD)
    if (action === "CONVERT") {
        await bankDb.updateBalance(userId, fromCurrency, -amount, body.email);
        await bankDb.updateBalance(userId, toAccount, amount, body.email);
        const user = await bankDb.getUserByEmail(body.email);
        return jsonWithSession({ success: true, user }, sessionId, isNew);
    }

    return jsonWithSession({ error: "Invalid action" }, sessionId, isNew, 400);
  } catch (err: any) {
    return jsonWithSession({ error: err.message || "Operation failed" }, sessionId, isNew, 400);
  }
}

export async function GET(request: NextRequest) {
    const { sessionId, isNew } = getOrCreateSessionId(request);
    const email = request.nextUrl.searchParams.get("email");
    if (!email) return jsonWithSession({ error: "Email required" }, sessionId, isNew, 400);
    const user = await bankDb.getUserByEmail(email);
    if (!user) return jsonWithSession({ error: "User not found" }, sessionId, isNew, 404);
    return jsonWithSession({ user }, sessionId, isNew);
}

export async function PUT(request: NextRequest) {
    const { sessionId, isNew } = getOrCreateSessionId(request);
    try {
        const { userId, amount, fromCurrency, toCurrency, email } = await request.json();
        
        if (fromCurrency === 'USD' && toCurrency === 'SPC') {
            await bankDb.updateBalance(userId, 'USD', -amount, email);
            await bankDb.updateBalance(userId, 'SPC', Math.abs(amount / 50000), email);
        } else if (fromCurrency === 'SPC' && toCurrency === 'USD') {
            await bankDb.updateBalance(userId, 'SPC', -amount, email);
            await bankDb.updateBalance(userId, 'USD', Math.abs(amount * 50000), email);
        }
        
        const user = await bankDb.getUserByEmail(email);
        return jsonWithSession({ success: true, user }, sessionId, isNew);
    } catch {
        return jsonWithSession({ error: "Exchange failed" }, sessionId, isNew, 400);
    }
}

export async function DELETE(request: NextRequest) {
    const { sessionId, isNew } = getOrCreateSessionId(request);
    try {
        const { action, amount, userId, email } = await request.json();
        if (action === "REDEEM") {
            const bonus = amount * 0.05;
            await bankDb.updateBalance(userId, 'USD', amount + bonus, email);
            const user = await bankDb.getUserByEmail(email);
            return jsonWithSession({ success: true, message: "Redeemed with bonus!", user }, sessionId, isNew);
        }
    } catch {
        return jsonWithSession({ error: "GC failed" }, sessionId, isNew, 400);
    }
}

export async function OPTIONS(request: NextRequest) {
    const { sessionId, isNew } = getOrCreateSessionId(request);
    const email = request.nextUrl.searchParams.get("email");
    if (!email) return jsonWithSession({ error: "Email required" }, sessionId, isNew, 400);
    const user = await bankDb.getUserByEmail(email);
    if (!user) return jsonWithSession({ error: "User not found" }, sessionId, isNew, 404);
    
    const total = user.usd_balance + (user.egp_balance / 50) + (user.spc_balance * 50000);
    if (total >= 1000000) return jsonWithSession({ success: true, flag: FLAG }, sessionId, isNew);
    return jsonWithSession({ success: false, currentValue: total }, sessionId, isNew, 403);
}
