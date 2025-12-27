/**
 * Pusher Authentication Endpoint
 *
 * Required for private and presence channels.
 * Authenticates users before they can subscribe to channels.
 */

import { getCurrentUser } from "@/lib/auth/session";
import { getPusherServer } from "@/lib/pusher/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    const pusher = getPusherServer();

    // For presence channels
    if (channelName.startsWith("presence-")) {
      // Generate user color for presence
      const colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
        "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
      ];
      const colorIndex = user.id.charCodeAt(0) % colors.length;
      const userColor = colors[colorIndex];

      const presenceData = {
        user_id: user.id,
        user_info: {
          id: user.id,
          name: user.name,
          email: user.email,
          color: userColor,
        },
      };

      const auth = pusher.authorizeChannel(socketId, channelName, presenceData);
      return NextResponse.json(auth);
    }

    // For private channels
    const auth = pusher.authorizeChannel(socketId, channelName);
    return NextResponse.json(auth);
  } catch (error) {
    console.error("[Pusher Auth] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
