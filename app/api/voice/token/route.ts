/**
 * Voice Token API - Generate Agora RTC tokens
 *
 * Ce endpoint génère un token temporaire pour rejoindre un channel Agora.
 * Le token est signé avec l'App Certificate (secret) côté serveur.
 */

import {
  errorResponse,
  forbiddenResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/types";
import { RtcRole, RtcTokenBuilder } from "agora-token";
import { NextRequest } from "next/server";

// Durée de validité du token (1 heure)
const TOKEN_EXPIRATION_SECONDS = 3600;

/**
 * POST /api/voice/token
 * Body: { sessionId: string }
 * Returns: { token: string, channel: string, uid: number }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // 2. Récupérer le sessionId
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return errorResponse("sessionId requis", 400);
    }

    // 3. Vérifier que l'utilisateur a accès à cette session
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
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

    if (!session) {
      return errorResponse("Session non trouvée", 404);
    }

    // Vérifier que l'user est membre du workspace
    if (session.workspace.members.length === 0) {
      return forbiddenResponse("Non membre de ce workspace");
    }

    // Vérifier que la session n'est pas terminée
    if (session.endedAt) {
      return errorResponse("Session terminée", 400);
    }

    // 4. Générer le token Agora
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error("[Voice] Missing Agora credentials");
      return errorResponse("Configuration Agora manquante", 500);
    }

    // Channel name basé sur la session
    const channelName = `session-${sessionId}`;

    // UID unique pour cet utilisateur (hash du odlUserId vers un nombre)
    // Agora accepte des UIDs de 0 à 2^32-1
    const uid = Math.abs(hashCode(user.id)) % 2147483647;

    // Timestamp d'expiration
    const expirationTimestamp =
      Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS;

    // Générer le token RTC
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER, // Peut publier de l'audio
      expirationTimestamp,
      expirationTimestamp // Privilege expiration
    );

    return successResponse({
      token,
      channel: channelName,
      uid,
      appId,
    });
  } catch (error: unknown) {
    console.error("[VOICE_TOKEN]", error);
    return errorResponse(getErrorMessage(error), 500);
  }
}

/**
 * Génère un hash numérique à partir d'une string
 * Utilisé pour convertir odlUserId (UUID) en UID numérique pour Agora
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
