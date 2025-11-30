import {
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser, isWorkspaceMember } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { InviteToWorkspaceSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * POST /api/workspaces/join
 * Join workspace with invite code
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate input
    const validated = InviteToWorkspaceSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { inviteCode } = validated.data;

    // Find workspace by invite code
    const workspace = await prisma.workspace.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
    });

    if (!workspace) {
      return notFoundResponse("Code d'invitation invalide");
    }

    // Check if already member
    const alreadyMember = await isWorkspaceMember(user.id, workspace.id);
    if (alreadyMember) {
      return errorResponse("Vous êtes déjà membre de ce workspace", 400);
    }

    // Add user as member
    const member = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "MEMBER",
      },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                members: true,
                sessions: true,
                files: true,
              },
            },
          },
        },
      },
    });

    return successResponse(
      {
        workspace: member.workspace,
        message: `Vous avez rejoint ${workspace.name}`,
      },
      201
    );
  } catch (error: any) {
    console.error("Join workspace error:", error);
    return errorResponse(error.message, 500);
  }
}
