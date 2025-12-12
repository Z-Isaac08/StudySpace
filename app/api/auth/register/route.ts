import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { CreateUserSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = CreateUserSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { email, password, name } = validated.data;

    // Create auth user in Supabase
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          name,
        },
      },
    });

    if (authError) {
      return errorResponse(getAuthErrorMessage(authError), 400);
    }

    if (!authData.user) {
      return errorResponse("Échec de la création du compte", 500);
    }

    // Note: User profile in Prisma will be created on first login
    // This avoids creating "zombie" users if email is never confirmed

    return successResponse(
      {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata.name,
        },
        message:
          "Compte créé avec succès. Vérifiez votre email pour confirmer.",
      },
      201
    );
  } catch (error: any) {
    console.error("💥 [REGISTER] Unexpected error:", error);
    return errorResponse(error.message || "Erreur lors de l'inscription", 500);
  }
}
