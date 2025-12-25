import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { EndStudySessionSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PUT /api/sessions/[id]/end
 * End a study session
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check if studySession exists
    const existingstudySession = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!existingstudySession) {
      return notFoundResponse("studySession introuvable");
    }

    // Check if user is creator
    if (existingstudySession.createdById !== user.id) {
      return forbiddenResponse(
        "Seul le créateur peut terminer la studySession"
      );
    }

    // Check if already ended
    if (existingstudySession.endedAt) {
      return errorResponse("Cette studySession est déjà terminée", 400);
    }

    const body = await request.json();

    // Validate input
    const validated = EndStudySessionSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { canvasState, editorState } = validated.data;

    const endedAt = new Date();
    const duration = Math.floor(
      (endedAt.getTime() - existingstudySession.startedAt.getTime()) / 1000
    );

    const studySession = await prisma.studySession.update({
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

    return successResponse(studySession);
  } catch (error: any) {
    console.error("End studySession error:", error);
    return errorResponse(error.message, 500);
  }
}
