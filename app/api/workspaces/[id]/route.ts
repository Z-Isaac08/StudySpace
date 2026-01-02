import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceOwner } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { getPusherServer } from "@/lib/pusher/server";
import { UpdateWorkspaceSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/workspaces/[id]
 * Get workspace details
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
        studySessions: {
          take: 10,
          orderBy: {
            startedAt: "desc",
          },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        files: {
          take: 20,
          orderBy: {
            uploadedAt: "desc",
          },
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return notFoundResponse("Workspace introuvable");
    }

    // Check if user is member
    const userMembership = workspace.members.find((m) => m.userId === user.id);
    if (!userMembership) {
      return forbiddenResponse("Vous n'êtes pas membre de ce workspace");
    }

    // Add _count for convenience
    const _count = {
      members: workspace.members.length,
      studySessions: workspace.studySessions.length,
      files: workspace.files.length,
    };

    return successResponse({
      ...workspace,
      userRole: userMembership.role,
      _count,
    });
  } catch (error: any) {
    console.error("Get workspace error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * PUT /api/workspaces/[id]
 * Update workspace (owner only)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check ownership
    const isOwner = await isWorkspaceOwner(user.id, id);
    if (!isOwner) {
      return forbiddenResponse(
        "Seul le propriétaire peut modifier le workspace"
      );
    }

    const body = await request.json();

    // Validate input
    const validated = UpdateWorkspaceSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const workspace = await prisma.workspace.update({
      where: { id },
      data: validated.data,
    });

    return successResponse(workspace);
  } catch (error: any) {
    console.error("Update workspace error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * DELETE /api/workspaces/[id]
 * Delete workspace (owner only)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check ownership
    const isOwner = await isWorkspaceOwner(user.id, id);
    if (!isOwner) {
      return forbiddenResponse(
        "Seul le propriétaire peut supprimer le workspace"
      );
    }

    // Broadcast workspace-deleted event BEFORE deleting
    // (so members still have access to the channel)
    try {
      const pusher = getPusherServer();
      await pusher.trigger(`private-workspace-${id}`, "workspace-deleted", {});
    } catch (err) {
      console.error("Failed to broadcast workspace-deleted:", err);
    }

    await prisma.workspace.delete({
      where: { id },
    });

    return successResponse({ message: "Workspace supprimé avec succès" });
  } catch (error: any) {
    console.error("Delete workspace error:", error);
    return errorResponse(error.message, 500);
  }
}
