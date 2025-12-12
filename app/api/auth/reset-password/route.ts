import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

/**
 * POST /api/auth/reset-password
 * Reset user password with new password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = ResetPasswordSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse(
        validated.error.issues[0]?.message || "Mot de passe invalide",
        400
      );
    }

    const { password } = validated.data;

    // Update password via Supabase
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return errorResponse(getAuthErrorMessage(error), 400);
    }

    return successResponse({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error: any) {
    console.error("💥 [RESET-PASSWORD] Unexpected error:", error);
    return errorResponse(
      error.message || "Erreur lors de la réinitialisation",
      500
    );
  }
}
