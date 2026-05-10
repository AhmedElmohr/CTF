import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a02-1";
const FLAG = "flag{d3f4u1t_cr3ds_r_b4d}";

interface A021Session {
  authenticated: boolean;
  role: string;
  username: string;
}

/**
 * GET /api/labs/a02-1/dashboard
 *
 * Protected dashboard endpoint. Returns system metrics and the flag
 * only if the user is authenticated with admin role.
 */
export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);
  const session = getSession<A021Session>(LAB_ID, sessionId);

  if (!session || !session.authenticated) {
    return jsonWithSession(
      { success: false, message: "Unauthorized. Please login first." },
      sessionId, isNew, 401
    );
  }

  return jsonWithSession(
    {
      success: true,
      user: { username: session.username, role: session.role },
      systemMetrics: {
        cpuUsage: "23.4%",
        memoryUsage: "67.2%",
        diskUsage: "41.8%",
        activeContainers: 12,
        uptime: "47d 13h 22m",
        alertsActive: 3,
      },
      servers: [
        { name: "web-prod-01", status: "healthy", cpu: "18%", mem: "4.2GB" },
        { name: "web-prod-02", status: "healthy", cpu: "22%", mem: "3.8GB" },
        { name: "db-primary", status: "warning", cpu: "67%", mem: "14.1GB" },
        { name: "cache-redis-01", status: "healthy", cpu: "5%", mem: "2.1GB" },
      ],
      secrets: {
        note: "Admin infrastructure secrets — never expose publicly!",
        dbConnectionString: "postgresql://admin:s3cretP@ss@db-primary:5432/prod",
        flag: FLAG,
      },
    },
    sessionId, isNew
  );
}
