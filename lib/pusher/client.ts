/**
 * Pusher Client Configuration - StudySpace
 */
import { getErrorMessage } from "@/lib/types";
import Pusher from "pusher-js";

// Empêcher l'exécution côté serveur (SSR)
const isBrowser = typeof window !== "undefined";

if (isBrowser && process.env.NODE_ENV === "development") {
  Pusher.logToConsole = true;
}

let pusherInstance: Pusher | null = null;

export function getPusherClient(): Pusher {
  // 1. Vérification côté client obligatoire
  if (!isBrowser) {
    throw new Error("getPusherClient must be called on the client side.");
  }

  if (!pusherInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      throw new Error(
        "Missing Pusher environment variables. Check NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER in .env.local"
      );
    }

    pusherInstance = new Pusher(key, {
      cluster,
      forceTLS: true,
      // Utilisation d'une URL absolue pour l'auth si nécessaire,
      // mais le chemin relatif fonctionne généralement en Next.js
      authEndpoint: "/api/pusher/auth",
    });

    if (process.env.NODE_ENV === "development") {
      pusherInstance.connection.bind(
        "state_change",
        (states: { previous: string; current: string }) => {
          console.log(
            `%c[Pusher] State: ${states.previous} → ${states.current}`,
            "color: #47A1FF"
          );
        }
      );

      pusherInstance.connection.bind("error", (err: unknown) => {
        console.error("[Pusher] Connection Error:", {
          error: err,
          type: (err as any)?.type,
          data: (err as any)?.data,
          message: getErrorMessage(err),
        });
      });
    }
  }

  return pusherInstance;
}

export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
    console.log("[Pusher] Disconnected");
  }
}
