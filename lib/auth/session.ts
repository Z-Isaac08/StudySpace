/**
 * Authentication Helper Functions
 * Utils for getting current user in API routes and Server Components
 */

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    // Get full user profile from Prisma
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Require authentication
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Check if user is workspace owner
 */
export async function isWorkspaceOwner(userId: string, workspaceId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId,
      role: "OWNER",
    },
  });

  return !!member;
}

/**
 * Check if user is workspace member
 */
export async function isWorkspaceMember(userId: string, workspaceId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  return !!member;
}
