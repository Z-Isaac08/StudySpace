import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { EndSessionSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PUT /api/sessions/[id]/end
 * End a session
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return notFoundResponse("Session introuvable");
    }

    // Check if user is creator
    if (existingSession.createdById !== user.id) {
      return forbiddenResponse("Seul le créateur peut terminer la session");
    }

    // Check if already ended
    if (existingSession.endedAt) {
      return errorResponse("Cette session est déjà terminée", 400);
    }

    const body = await request.json();

    // Validate input
    const validated = EndSessionSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { canvasState, editorState } = validated.data;

    const endedAt = new Date();
    const duration = Math.floor(
      (endedAt.getTime() - existingSession.startedAt.getTime()) / 1000
    );

    const session = await prisma.session.update({
      where: { id },
      data: {
        endedAt,
        duration,
        canvasState,
        editorState,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
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

    return successResponse(session);
  } catch (error: any) {
    console.error("End session error:", error);
    return errorResponse(error.message, 500);
  }
}
