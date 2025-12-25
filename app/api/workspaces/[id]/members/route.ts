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
import { NextRequest } from "next/server";
import { z } from "zod";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const AddMemberSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
});

const UpdateMemberRoleSchema = z.object({
  userId: z.uuid({ message: "ID utilisateur invalide" }),
  role: z.enum(["OWNER", "MEMBER"], {
    message: "Rôle invalide",
  }),
});

/**
 * POST /api/workspaces/[id]/members
 * Add member to workspace (owner only)
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id: workspaceId } = await params;

    // Check ownership
    const isOwner = await isWorkspaceOwner(user.id, workspaceId);
    if (!isOwner) {
      return forbiddenResponse("Seul le propriétaire peut ajouter des membres");
    }

    const body = await request.json();
    const validated = AddMemberSchema.safeParse(body);

    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { email } = validated.data;

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return notFoundResponse("Utilisateur introuvable avec cet email");
    }

    // Check if already member
    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: targetUser.id,
          workspaceId,
        },
      },
    });

    if (existingMembership) {
      return errorResponse("Cet utilisateur est d�j� membre du workspace", 400);
    }

    // Add member
    const membership = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role: "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(membership, 201);
  } catch (error: any) {
    console.error("Add member error:", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * PATCH /api/workspaces/[id]/members
 * Update member role (owner only)
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { id: workspaceId } = await params;

    // Check ownership
    const isOwner = await isWorkspaceOwner(user.id, workspaceId);
    if (!isOwner) {
      return forbiddenResponse("Seul le propriétaire peut modifier les r�les");
    }

    const body = await request.json();
    const validated = UpdateMemberRoleSchema.safeParse(body);

    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { userId, role } = validated.data;

    // Prevent owner from changing own role
    if (userId === user.id) {
      return errorResponse(
        "Vous ne pouvez pas modifier votre propre r�le",
        400
      );
    }

    // Update role
    const membership = await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(membership);
  } catch (error: any) {
    console.error("Update member role error:", error);
    return errorResponse(error.message, 500);
  }
}
