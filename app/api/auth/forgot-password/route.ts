import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.email("Email invalide"),
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = ForgotPasswordSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse("Email invalide", 400);
    }

    const { email } = validated.data;

    // Send reset email via Supabase
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return errorResponse(getAuthErrorMessage(error), 400);
    }

    // Always return success even if email doesn't exist (security)
    return successResponse({
      message: "Email de réinitialisation envoyé",
    });
  } catch (error: any) {
    console.error("💥 [FORGOT-PASSWORD] Unexpected error:", error);
    return errorResponse(
      error.message || "Erreur lors de l'envoi de l'email",
      500
    );
  }
}
