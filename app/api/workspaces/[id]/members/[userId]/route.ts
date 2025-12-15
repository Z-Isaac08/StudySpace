import {
  errorResponse,
  forbiddenResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceOwner } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type Params = {
  params: Promise<{
    id: string;
    userId: string;
  }>;
};

/**
 * DELETE /api/workspaces/[id]/members/[userId]
 * Remove member from workspace (owner only, or self-leave)
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id: workspaceId, userId: targetUserId } = await params;

    // Check if user is trying to leave (self-remove)
    const isSelf = targetUserId === user.id;

    // If not self, must be owner
    if (!isSelf) {
      const isOwner = await isWorkspaceOwner(user.id, workspaceId);
      if (!isOwner) {
        return forbiddenResponse(
          "Seul le propriétaire peut retirer des membres"
        );
      }
    }

    // Prevent owner from leaving if they're the last owner
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: targetUserId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return errorResponse("Membre introuvable", 404);
    }

    if (membership.role === "OWNER") {
      // Count total owners
      const ownerCount = await prisma.workspaceMember.count({
        where: {
          workspaceId,
          role: "OWNER",
        },
      });

      if (ownerCount <= 1) {
        return errorResponse(
          "Impossible de retirer le dernier propriétaire. Transf�rez la propri�t� ou supprimez le workspace.",
          400
        );
      }
    }

    // Remove member
    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId: targetUserId,
          workspaceId,
        },
      },
    });

    return successResponse({
      message: isSelf
        ? "Vous avez quitté le workspace avec succ�s"
        : "Membre retiré avec succ�s",
    });
  } catch (error: any) {
    console.error("Remove member error:", error);
    return errorResponse(error.message, 500);
  }
}
