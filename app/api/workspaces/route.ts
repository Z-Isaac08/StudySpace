import type { Prisma } from "@/generated/prisma/client";
import {
    errorResponse,
    successResponse,
    unauthorizedResponse,
    validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/types";
import { CreateWorkspaceSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * GET /api/workspaces
 * Get workspaces for current user with pagination, filtering, and sorting
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - tag: WorkspaceTag (filter by tag)
 * - search: string (search in workspace name)
 * - sortBy: "name" | "updatedAt" | "createdAt" (default: "updatedAt")
 * - sortOrder: "asc" | "desc" (default: "desc")
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    // Build where clause with proper Prisma type
    const where: Prisma.WorkspaceWhereInput = {
      members: {
        some: {
          userId: user.id,
        },
      },
    };

    // Add tag filter
    if (tag) {
      where.tag = tag as Prisma.EnumWorkspaceTagFilter;
    }

    // Add search filter
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Build orderBy clause with proper Prisma type
    const orderBy: Prisma.WorkspaceOrderByWithRelationInput = {};
    if (sortBy === "name" || sortBy === "createdAt" || sortBy === "updatedAt") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.updatedAt = "desc"; // Default fallback
    }

    // Execute queries in parallel for performance
    const [workspaces, totalCount] = await Promise.all([
      prisma.workspace.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              members: true,
              studySessions: true,
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
        orderBy,
      }),
      prisma.workspace.count({ where }),
    ]);

    // Format response with user role
    const formatted = workspaces.map((workspace) => ({
      ...workspace,
      userRole: workspace.members[0]?.role || "MEMBER",
      members: undefined, // Remove from response
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return successResponse({
      data: formatted,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error: unknown) {
    logger.error("[WORKSPACES_GET]", error);
    return errorResponse(getErrorMessage(error), 500);
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
        createdById: user.id,
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
            studySessions: true,
            files: true,
          },
        },
      },
    });

    return successResponse(workspace, 201);
  } catch (error: unknown) {
    logger.error("Create workspace error:", error);
    return errorResponse(getErrorMessage(error), 500);
  }
}
