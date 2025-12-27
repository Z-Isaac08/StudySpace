/**
 * Yjs Document State API
 *
 * GET: Load Yjs document state from database
 * POST: Save Yjs document state to database
 */

import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/sessions/[id]/yjs
 * Load Yjs document state
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get session with Yjs state
    const session = await prisma.studySession.findUnique({
      where: { id },
      select: {
        id: true,
        editorState: true,
        workspaceId: true,
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if user is member of workspace
    if (session.workspace.members.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract Yjs state from editorState
    const yjsState = session.editorState
      ? (session.editorState as any).yjsState
      : null;

    return NextResponse.json({
      success: true,
      data: {
        yjsState,
      },
    });
  } catch (error: any) {
    console.error("[Yjs GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions/[id]/yjs
 * Save Yjs document state
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { yjsState } = body;

    if (!yjsState) {
      return NextResponse.json(
        { error: "Missing yjsState" },
        { status: 400 }
      );
    }

    // Get session and check permissions
    const session = await prisma.studySession.findUnique({
      where: { id },
      select: {
        id: true,
        editorState: true,
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if user is member of workspace
    if (session.workspace.members.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update editorState with Yjs state
    const currentEditorState = (session.editorState as any) || {};
    const updatedEditorState = {
      ...currentEditorState,
      yjsState,
      lastUpdated: new Date().toISOString(),
    };

    await prisma.studySession.update({
      where: { id },
      data: {
        editorState: updatedEditorState,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Yjs state saved",
    });
  } catch (error: any) {
    console.error("[Yjs POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
