import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Get current authenticated session using Better Auth
 * Returns null if not authenticated
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return null;
    }

    // Get full user profile from Prisma with relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
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
