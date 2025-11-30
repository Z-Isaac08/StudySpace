import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = LoginSchema.safeParse(body);
    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const { email, password } = validated.data;

    // Sign in with Supabase Auth
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return unauthorizedResponse("Email ou mot de passe incorrect");
    }

    if (!data.user) {
      return errorResponse("Échec de la connexion", 500);
    }

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
      message: "Connexion réussie",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return errorResponse(error.message || "Erreur lors de la connexion", 500);
  }
}
