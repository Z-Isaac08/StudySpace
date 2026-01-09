/**
 * Files Save API - Save uploaded file to database
 * Called after successful client-side upload to Vercel Blob
 */

import {
  errorResponse,
  forbiddenResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/types";
import { SaveFileSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * POST /api/files/save
 * Save uploaded file metadata to database
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate input
    const validated = SaveFileSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { workspaceId, name, url, size, mimeType } = validated.data;

    // Check user is member of workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return forbiddenResponse("Non membre de ce workspace");
    }

    // Save file to database
    const file = await prisma.file.create({
      data: {
        workspaceId,
        uploadedById: user.id,
        name,
        size,
        mimeType,
        url,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(file, 201);
  } catch (error: unknown) {
    console.error("[FILES_SAVE]", error);
    return errorResponse(getErrorMessage(error), 500);
  }
}
