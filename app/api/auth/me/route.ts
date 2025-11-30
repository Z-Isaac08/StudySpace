import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user from Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return unauthorizedResponse("Non authentifié");
    }

    // Get user profile from Prisma
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            workspaces: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("Profil utilisateur introuvable", 404);
    }

    return successResponse(user);
  } catch (error: any) {
    console.error("Get user error:", error);
    return errorResponse(
      error.message || "Erreur lors de la récupération de l'utilisateur",
      500
    );
  }
}
