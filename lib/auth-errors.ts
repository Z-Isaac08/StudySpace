/**
 * Auth Error Messages
 * Maps Supabase auth error codes to user-friendly French messages
 */

export function getAuthErrorMessage(error: any): string {
  // If error has a code property (Supabase errors)
  const code = error?.code || error?.error_code;

  const errorMessages: Record<string, string> = {
    // Email/Password errors
    email_not_confirmed:
      "Veuillez confirmer votre email avant de vous connecter",
    invalid_credentials: "Email ou mot de passe incorrect",
    user_not_found: "Aucun compte associé à cet email",
    email_exists: "Un compte existe déjà avec cet email",
    user_already_exists: "Un compte existe déjà avec cet email",

    // Password errors
    weak_password:
      "Le mot de passe est trop faible. Utilisez au moins 8 caractères avec lettres et chiffres",
    password_too_short: "Le mot de passe doit contenir au moins 8 caractères",

    // Rate limiting
    over_email_send_rate_limit:
      "Trop de tentatives. Veuillez réessayer dans quelques minutes",
    too_many_requests: "Trop de tentatives. Veuillez réessayer plus tard",

    // Session errors
    session_not_found: "Session expirée. Veuillez vous reconnecter",
    refresh_token_not_found: "Session invalide. Veuillez vous reconnecter",

    // Validation errors
    validation_failed: "Les données fournies sont invalides",
    email_address_invalid: "L'adresse email n'est pas valide",

    // Network/Server errors
    network_error: "Erreur de connexion. Vérifiez votre connexion internet",
    server_error: "Erreur serveur. Veuillez réessayer",
  };

  // Return mapped message or default
  if (code && errorMessages[code]) {
    return errorMessages[code];
  }

  // Check error message for common patterns
  const message = error?.message?.toLowerCase() || "";

  if (message.includes("email not confirmed")) {
    return errorMessages.email_not_confirmed;
  }
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return errorMessages.invalid_credentials;
  }
  if (
    message.includes("user already registered") ||
    message.includes("already exists")
  ) {
    return errorMessages.email_exists;
  }
  if (message.includes("password") && message.includes("weak")) {
    return errorMessages.weak_password;
  }
  if (message.includes("rate limit")) {
    return errorMessages.over_email_send_rate_limit;
  }

  // Default fallback
  return error?.message || "Une erreur est survenue. Veuillez réessayer";
}
