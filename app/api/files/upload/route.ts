/**
 * Files Upload API - Client upload handler
 * Generates tokens for secure client-side uploads to Vercel Blob
 */

import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/prisma';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { uploadLimiter } from '@/lib/rate-limit';

export async function POST(request: Request): Promise<NextResponse> {
  // Get IP address for rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  // Use the rate limiter (e.g., 5 requests per minute)
  const { success } = await uploadLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate user
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('Unauthorized');
        }

        // Parse client payload
        const payload = clientPayload ? JSON.parse(clientPayload) : {};
        const { workspaceId } = payload;

        if (!workspaceId) {
          throw new Error('workspaceId is required');
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
          throw new Error('Not a member of this workspace');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'application/pdf',
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: user.id,
            workspaceId,
            filename: pathname,
          }),
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB limit
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('[Files] Upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during upload. Please try again.' }, 
      { status: 400 }
    );
  }
}
