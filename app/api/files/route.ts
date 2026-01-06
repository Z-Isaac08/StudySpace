/**
 * Files API - List files for a workspace
 */

import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/files?workspaceId=xxx
 * List files for a workspace
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // Check user is member of workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    // Get files
    const files = await prisma.file.findMany({
      where: { workspaceId },
      orderBy: { uploadedAt: "desc" },
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("[Files API] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
