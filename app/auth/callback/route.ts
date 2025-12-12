import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ [CALLBACK] Exchange code error:", error);
      return NextResponse.redirect(
        new URL("/login?error=auth_callback_error", requestUrl.origin)
      );
    }

    // Ensure user exists in Prisma (first login after confirmation)
    if (data?.user) {
      try {
        const { prisma } = await import("@/lib/prisma");

        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            name:
              data.user.user_metadata?.name ||
              data.user.user_metadata?.full_name ||
              "",
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.name ||
              data.user.user_metadata?.full_name ||
              "",
            passwordHash: "", // Managed by Supabase
          },
        });

        console.log("✅ [CALLBACK] User upserted in Prisma:", data.user.id);
      } catch (prismaError) {
        console.error("❌ [CALLBACK] Prisma upsert error:", prismaError);
        // Continue - don't block login if Prisma fails
      }
    }

    // Redirect to dashboard or specified page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code found
  console.error("❌ [CALLBACK] No code found in URL");
  return NextResponse.redirect(
    new URL("/login?error=no_code", requestUrl.origin)
  );
}
