/**
 * Pusher Server Configuration - StudySpace
 */
import Pusher from "pusher";

// Étendre l'objet global pour TypeScript afin de stocker l'instance Pusher
declare global {
  var pusherServerInstance: Pusher | undefined;
}

export function getPusherServer(): Pusher {
  // En production, on utilise une variable locale,
  // en développement, on attache à 'global' pour éviter les duplications au Hot Reload
  if (!global.pusherServerInstance) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      throw new Error(
        "Missing Pusher server variables. Check PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, and PUSHER_CLUSTER in .env.local"
      );
    }

    global.pusherServerInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });

    console.log("[Pusher Server] ✅ Instance initialized");
  }

  return global.pusherServerInstance;
}
