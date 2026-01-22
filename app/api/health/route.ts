import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Health Check API Route
 * GET /api/health
 * 
 * Returns application and database status for monitoring
 */
export async function GET() {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      database: "connected",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "0.1.0",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
