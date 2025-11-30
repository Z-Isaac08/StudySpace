import {
  errorResponse,
  forbiddenResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceMember } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { CreateSessionSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * GET /api/sessions
 * Get sessions for a workspace
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return errorResponse("workspaceId est requis", 400);
    }

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    const sessions = await prisma.session.findMany({
      where: { workspaceId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 50,
    });

    return successResponse(sessions);
  } catch (error: any) {
    console.error("Get sessions error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * POST /api/sessions
 * Start a new session
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate input
    const validated = CreateSessionSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { workspaceId } = validated.data;

    // Check if user is workspace member
    const isMember = await isWorkspaceMember(user.id, workspaceId);
    if (!isMember) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    const session = await prisma.session.create({
      data: {
        workspaceId,
        createdById: user.id,
        startedAt: new Date(),
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

    return successResponse(session, 201);
  } catch (error: any) {
    console.error("Create session error:", error);
    return errorResponse(error.message, 500);
  }
}
