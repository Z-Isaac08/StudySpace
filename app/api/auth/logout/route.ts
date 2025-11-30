import { errorResponse, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * POST /api/auth/logout
 * Logout current user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse({ message: "Déconnexion réussie" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return errorResponse(error.message || "Erreur lors de la déconnexion", 500);
  }
}
