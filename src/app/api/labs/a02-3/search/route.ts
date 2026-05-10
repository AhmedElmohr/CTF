import { NextRequest, NextResponse } from "next/server";

const FLAG = "flag{st4ck_tr4c3_1nt3l}";

/**
 * POST /api/labs/a02-3/search
 *
 * VULNERABILITY: Verbose Error Messages — When the server receives
 * malformed input, it returns a full stack trace that leaks:
 * - Internal file paths
 * - Database credentials
 * - The flag (hidden in environment variables)
 *
 * Valid JSON → normal search results
 * Invalid JSON → verbose 500 error with full stack trace
 */
export async function POST(request: NextRequest) {
  let body: string;

  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body." }, { status: 400 });
  }

  // Try to parse JSON
  try {
    const parsed = JSON.parse(body);

    if (!parsed.query) {
      return NextResponse.json(
        { error: "Missing 'query' field in request body." },
        { status: 400 }
      );
    }

    // Intentional insecure behavior for the lab:
    // certain injected patterns cause a backend crash path that leaks debug data.
    const query = String(parsed.query);
    if (
      query.includes("'") ||
      query.includes('"') ||
      query.includes("--") ||
      query.toLowerCase().includes("error")
    ) {
      throw new Error(`Unexpected token in search expression: ${query}`);
    }

    // Normal search results
    return NextResponse.json({
      status: 200,
      results: [
        { id: 1, title: `Results for: "${query}"`, snippet: "Lorem ipsum dolor sit amet..." },
        { id: 2, title: "Related article", snippet: "Consectetur adipiscing elit..." },
      ],
      totalResults: 2,
      took: "12ms",
    });
  } catch (e) {
    // VULNERABLE: Return verbose error with stack trace and leaked secrets
    const errorMessage = e instanceof Error ? e.message : "Unknown parse error";

    const verboseError = {
      error: "Internal Server Error",
      status: 500,
      message: errorMessage,
      stackTrace: [
        `SyntaxError: ${errorMessage}`,
        "    at JSON.parse (<anonymous>)",
        "    at SearchController.handlePost (/app/server/controllers/search.js:42:25)",
        "    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)",
        "    at next (/app/node_modules/express/lib/router/route.js:144:13)",
        "    at Route.dispatch (/app/node_modules/express/lib/router/route.js:114:3)",
        "    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)",
        "    at /app/node_modules/express/lib/router/index.js:284:15",
        "    at Function.process_params (/app/node_modules/express/lib/router/index.js:346:12)",
        "    at connectDB (/app/server/middleware/db.js:18:7)",
        "    at Object.<anonymous> (/app/server/config/database.js:3:1)",
      ].join("\n"),
      environment: {
        NODE_ENV: "development",
        DEBUG: "true",
        APP_PORT: "8080",
        DB_HOST: "internal-db-cluster-01.ctf.local",
        DB_PORT: "5432",
        DB_NAME: "search_engine_prod",
        DB_USER: "admin",
        DB_PASS: FLAG,
        REDIS_URL: "redis://cache-01.internal:6379",
        SECRET_KEY: "sk_test_mock_key_not_real_for_lab_purposes",
      },
      serverInfo: {
        hostname: "api-prod-worker-03",
        platform: "linux",
        nodeVersion: "v20.11.0",
        expressVersion: "4.18.2",
        uptime: "432891s",
      },
    };

    return NextResponse.json(verboseError, { status: 500 });
  }
}
