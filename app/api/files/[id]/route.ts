/**
 * Files API - Delete a file
 */

import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/files/[id]
 * Delete a file (only uploader or workspace owner)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get file with workspace info
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check permissions: uploader or workspace owner
    const membership = file.workspace.members[0];
    const isUploader = file.uploadedById === user.id;
    const isOwner = membership?.role === "OWNER";

    if (!isUploader && !isOwner) {
      return NextResponse.json(
        { error: "Not authorized to delete this file" },
        { status: 403 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(file.url);
    } catch (blobError) {
      console.error("[Files] Blob delete error:", blobError);
      // Continue with DB deletion even if blob fails
    }

    // Delete from database
    await prisma.file.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Files API] DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
