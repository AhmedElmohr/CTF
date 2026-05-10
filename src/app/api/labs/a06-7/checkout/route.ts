import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/labs/a06-7/checkout
 * 
 * Vulnerable endpoint for Advanced Price Manipulation.
 * It trusts the 'price' field sent from the client without 
 * server-side verification.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, itemName, price, currency, paymentMethod } = body;

    // Simulate database lookup (which SHOULD happen, but we're skipping it for the vulnerability)
    // Real price of 'Spark Veneno V12' is $120,000.00
    
    if (!itemId || !price) {
      return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
    }

    // Vulnerability: We trust the 'price' from the request body!
    if (price < 10) {
      return NextResponse.json({
        success: true,
        message: "Order Processed Successfully!",
        orderId: `ORD-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
        flag: "flag{spark_luxury_h4ck_99x}",
        receipt: {
          item: itemName || "Luxury Vehicle",
          amount_paid: `${currency || "$"}${price}`,
          status: "Paid in Full"
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order Received. Awaiting high-value payment confirmation.",
      orderId: `ORD-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
      receipt: {
        item: itemName || "Luxury Vehicle",
        amount_paid: `${currency || "$"}${price}`,
        status: "Pending Verification"
      }
    });

  } catch (err) {
    return NextResponse.json({ error: "Checkout system failure." }, { status: 500 });
  }
}
