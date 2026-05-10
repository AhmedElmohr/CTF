import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/labs/a02-1/docs
 *
 * Leaked documentation page that reveals default credentials.
 * In a real scenario, this would be a README or setup guide
 * accidentally left accessible on the production server.
 */
export async function GET(request: NextRequest) {
  const doc = {
    product: "GrafanaBoard Monitoring Suite",
    version: "4.2.1-stable",
    releaseDate: "2025-01-15",
    quickStart: {
      step1: "Deploy the container using: docker run -p 3000:3000 grafanaboard/server:latest",
      step2: "Access the dashboard at http://your-server:3000",
      step3: "Login with the default credentials below",
      step4: "IMPORTANT: Change the default password immediately after first login!",
    },
    defaultCredentials: {
      admin: {
        username: "admin",
        password: "admin",
        note: "Full system administrator access. CHANGE THIS IMMEDIATELY.",
      },
      serviceAccount: {
        username: "grafana",
        password: "grafana123",
        note: "Read-only service account for automated dashboards.",
      },
    },
    apiEndpoints: {
      login: "POST /api/labs/a02-1/login",
      dashboard: "GET /api/labs/a02-1/dashboard",
      docs: "GET /api/labs/a02-1/docs (this page)",
    },
    securityNotice:
      "WARNING: Failure to change default credentials may result in unauthorized access to sensitive monitoring data including infrastructure secrets.",
  };

  return NextResponse.json(doc);
}
