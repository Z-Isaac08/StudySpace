/**
 * API Response Utilities
 * Standardized responses for Next.js API routes
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

// ============================================
// SUCCESS RESPONSES
// ============================================

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function createdResponse<T>(data: T) {
  return successResponse(data, 201);
}

// ============================================
// ERROR RESPONSES
// ============================================

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: "Validation échouée",
      details: error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(message = "Non authentifié") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Accès interdit") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Resource non trouvée") {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message = "Erreur serveur") {
  console.error("Server error:", message);
  return errorResponse(
    process.env.NODE_ENV === "development" ? message : "Erreur serveur",
    500
  );
}
