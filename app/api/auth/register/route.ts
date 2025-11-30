import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
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
        data: {
          name,
        },
      },
    });

    if (authError) {
      return errorResponse(authError.message, 400);
    }

    if (!authData.user) {
      return errorResponse("Échec de la création du compte", 500);
    }

    // Create user profile in Prisma
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
        name,
        passwordHash: "", // Managed by Supabase Auth
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return successResponse(
      {
        user,
        message:
          "Compte créé avec succès. Vérifiez votre email pour confirmer.",
      },
      201
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return errorResponse(error.message || "Erreur lors de l'inscription", 500);
  }
}
