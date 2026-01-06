import {
    errorResponse,
    forbiddenResponse,
    notFoundResponse,
    successResponse,
    unauthorizedResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceMember } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/types";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/sessions/[id]/notes
 * Get current user's private notes for this session
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id: sessionId } = await params;

    // Check if session exists
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
      select: { workspaceId: true },
    });

    if (!session) {
      return notFoundResponse("Session non trouvée");
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, session.workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    // Get or create notes for this user
    let note = await prisma.sessionNote.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: user.id,
        },
      },
    });

    // If no note exists, return empty content
    if (!note) {
      return successResponse({
        id: null,
        sessionId,
        userId: user.id,
        content: "",
        createdAt: null,
        updatedAt: null,
      });
    }

    return successResponse(note);
  } catch (error: unknown) {
    console.error("Get session notes error:", error);
    return errorResponse(getErrorMessage(error), 500);
  }
}

/**
 * PUT /api/sessions/[id]/notes
 * Update current user's private notes for this session
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id: sessionId } = await params;
    const body = await request.json();

    if (typeof body.content !== "string") {
      return errorResponse("Le contenu des notes est requis", 400);
    }

    // Check if session exists
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
      select: { workspaceId: true },
    });

    if (!session) {
      return notFoundResponse("Session non trouvée");
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, session.workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    // Upsert notes (create if not exists, update if exists)
    const note = await prisma.sessionNote.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId: user.id,
        },
      },
      update: {
        content: body.content,
      },
      create: {
        sessionId,
        userId: user.id,
        content: body.content,
      },
    });

    return successResponse(note);
  } catch (error: unknown) {
    console.error("Update session notes error:", error);
    return errorResponse(getErrorMessage(error), 500);
  }
}
