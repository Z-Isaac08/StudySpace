/**
 * Pusher Broadcast Endpoint
 *
 * Server-side event broadcasting for real-time collaboration.
 * More reliable than client events (no 10KB limit, no 403 errors).
 */

import { getCurrentUser } from "@/lib/auth/session";
import { getPusherServer } from "@/lib/pusher/server";
import { NextRequest, NextResponse } from "next/server";

interface BroadcastRequest {
  channel: string;
  event: string;
  data: unknown;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: BroadcastRequest = await request.json();
    const { channel, event, data } = body;

    if (!channel || !event || data === undefined) {
      return NextResponse.json(
        { error: "Missing channel, event, or data" },
        { status: 400 }
      );
    }

    // Validate channel name (must be presence or private)
    if (!channel.startsWith("presence-") && !channel.startsWith("private-")) {
      return NextResponse.json(
        { error: "Invalid channel type. Must be presence- or private-" },
        { status: 400 }
      );
    }

    // Broadcast event via Pusher server
    const pusher = getPusherServer();

    await pusher.trigger(channel, event, {
      ...((typeof data === "object" && data !== null) ? data : { data }),
      _senderId: user.id, // Include sender ID for filtering
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Pusher Broadcast] Error:", error);
    return NextResponse.json(
      { error: "Failed to broadcast event" },
      { status: 500 }
    );
  }
}
