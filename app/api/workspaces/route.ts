import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { CreateWorkspaceSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * GET /api/workspaces
 * Get all workspaces for current user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            sessions: true,
            files: true,
          },
        },
        members: {
          where: { userId: user.id },
          select: {
            role: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format response with user role
    const formatted = workspaces.map((workspace) => ({
      ...workspace,
      userRole: workspace.members[0]?.role || "MEMBER",
      members: undefined, // Remove from response
    }));

    return successResponse(formatted);
  } catch (error: any) {
    console.error("Get workspaces error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate input
    const validated = CreateWorkspaceSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { name, tag } = validated.data;

    // Generate invite code (8 characters)
    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Create workspace with owner member
    const workspace = await prisma.workspace.create({
      data: {
        name,
        tag,
        inviteCode,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            sessions: true,
            files: true,
          },
        },
      },
    });

    return successResponse(workspace, 201);
  } catch (error: any) {
    console.error("Create workspace error:", error);
    return errorResponse(error.message, 500);
  }
}
