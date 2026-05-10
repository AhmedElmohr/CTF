import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/labs/a02-2/files?path=/
 *
 * Directory listing endpoint. Returns the contents of a simulated
 * file system. The vulnerability is that directory listing is enabled,
 * exposing backup files with sensitive data.
 */

const FLAG = "flag{spark_st0r4ge_l34k_v2}";

const fileSystem: Record<string, Array<{name: string; type: "dir"|"file"; size?: string; modified?: string; path?: string}>> = {
  "/": [
    { name: "assets/", type: "dir", path: "/assets", modified: "2026-05-01 10:23" },
    { name: "public/", type: "dir", path: "/public", modified: "2026-05-01 10:23" },
    { name: "robots.txt", type: "file", size: "1.1K", modified: "2026-05-01 10:23" },
  ],
  "/assets": [
    { name: "../", type: "dir", path: "/" },
    { name: "images/", type: "dir", path: "/assets/images", modified: "2026-05-01 08:11" },
    { name: "scripts/", type: "dir", path: "/assets/scripts", modified: "2026-05-01 14:05" },
    { name: "backup/", type: "dir", path: "/assets/backup", modified: "2026-05-08 03:00" },
  ],
  "/assets/images": [
    { name: "../", type: "dir", path: "/assets" },
    { name: "spark-logo-white.svg", type: "file", size: "12K", modified: "2026-05-01 08:11" },
    { name: "dashboard-hero.webp", type: "file", size: "450K", modified: "2026-05-01 08:11" },
  ],
  "/assets/scripts": [
    { name: "../", type: "dir", path: "/assets" },
    { name: "auth.bundle.js", type: "file", size: "1.2M", modified: "2026-05-01 14:05" },
    { name: "analytics.v2.js", type: "file", size: "85K", modified: "2026-05-01 14:05" },
  ],
  "/assets/backup": [
    { name: "../", type: "dir", path: "/assets" },
    { name: "production_db_dump.sql.gz", type: "file", size: "125M", modified: "2026-05-08 03:00" },
    { name: "internal_api_keys.env", type: "file", size: "2.4K", modified: "2026-05-08 03:00" },
    { name: "SYSTEM_ACCESS.txt", type: "file", size: "156", modified: "2026-05-08 03:00" },
  ],
  "/public": [
    { name: "../", type: "dir", path: "/" },
    { name: "terms_of_service.pdf", type: "file", size: "2.1M", modified: "2026-05-01 10:23" },
    { name: "brand_guidelines.zip", type: "file", size: "15.4M", modified: "2026-05-01 10:23" },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";

    const contents = fileSystem[path];

    if (!contents) {
      return NextResponse.json(
        { error: `Resource not found at: ${path}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      server: "SparkEdge/4.2.1-Enterprise",
      path,
      contents,
      status: "Ready"
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error during resource listing." },
      { status: 500 }
    );
  }
}
