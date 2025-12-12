import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const ResendVerificationSchema = z.object({
  email: z.email("Email invalide"),
});

/**
 * POST /api/auth/resend-verification
 * Resend email verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = ResendVerificationSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse("Email invalide", 400);
    }

    const { email } = validated.data;

    // Resend verification email via Supabase
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      // Handle rate limit specifically
      if (error.status === 429) {
        return errorResponse("Trop de demandes. Veuillez patienter 60s.", 429);
      }
      return errorResponse(getAuthErrorMessage(error), 400);
    }

    return successResponse({
      message: "Email de vérification renvoyé",
    });
  } catch (error: any) {
    console.error("💥 [RESEND-VERIFICATION] Unexpected error:", error);
    return errorResponse(error.message || "Erreur lors de l'envoi", 500);
  }
}
