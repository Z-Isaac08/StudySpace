/**
 * Files Upload API - Client upload handler
 * Generates tokens for secure client-side uploads to Vercel Blob
 */

import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate user
        const user = await getCurrentUser();
        if (!user) {
          throw new Error("Unauthorized");
        }

        // Parse client payload
        const payload = clientPayload ? JSON.parse(clientPayload) : {};
        const { workspaceId } = payload;

        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }

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
          throw new Error("Not a member of this workspace");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: user.id,
            workspaceId,
            filename: pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Note: File is saved to database via /api/files/save after client upload
        // onUploadCompleted is a webhook that doesn't work in local dev
        console.log("[Files] Upload completed:", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[Files] Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
