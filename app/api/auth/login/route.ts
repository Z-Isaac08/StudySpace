import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { prisma } from "@/lib/prisma";
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
      return unauthorizedResponse(getAuthErrorMessage(error));
    }

    if (!data.user) {
      return errorResponse("Échec de la connexion", 500);
    }

    // Create or update user profile in Prisma on first login
    // This ensures user is only created after email confirmation
    const user = await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: data.user.email!,
        name: data.user.user_metadata.name || "",
      },
      create: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name || "",
        passwordHash: "", // Managed by Supabase Auth
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return successResponse({
      user,
      message: "Connexion réussie",
    });
  } catch (error: any) {
    console.error("💥 [LOGIN] Unexpected error:", error);
    return errorResponse(error.message || "Erreur lors de la connexion", 500);
  }
}
