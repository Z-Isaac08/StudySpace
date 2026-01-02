import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceMember } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { UpdateStudySessionSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/sessions/[id]
 * Get session details
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const session = await prisma.studySession.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            tag: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return notFoundResponse("Session non trouvée");
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, session.workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    return successResponse(session);
  } catch (error: any) {
    console.error("Get session error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * PUT /api/sessions/[id]
 * Update session (auto-save canvas/editor state)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validated = UpdateStudySessionSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    // Check if session exists
    const existingSession = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return notFoundResponse("Session non trouvée");
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(
      user.id,
      existingSession.workspaceId
    );
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    // Update session
    const updatedSession = await prisma.studySession.update({
      where: { id },
      data: {
        canvasState: validated.data.canvasState ?? existingSession.canvasState,
        editorState: validated.data.editorState ?? existingSession.editorState,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            tag: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return successResponse(updatedSession);
  } catch (error: any) {
    console.error("Update session error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * DELETE /api/sessions/[id]
 * Delete a session
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const session = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!session) {
      return notFoundResponse("Session non trouvée");
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, session.workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    // Only allow session creator or workspace owner to delete
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: session.workspaceId,
        userId: user.id,
      },
    });

    const canDelete =
      session.createdById === user.id || membership?.role === "OWNER";

    if (!canDelete) {
      return forbiddenResponse(
        "Seul le créateur de la session ou le propriétaire du workspace peut la supprimer"
      );
    }

    await prisma.studySession.delete({
      where: { id },
    });

    return successResponse({ message: "Session supprimée avec succès" });
  } catch (error: any) {
    console.error("Delete session error:", error);
    return errorResponse(error.message, 500);
  }
}
