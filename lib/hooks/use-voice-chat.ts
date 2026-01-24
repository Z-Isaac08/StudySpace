"use client";

/**
 * useVoiceChat Hook
 *
 * Gère la connexion voice via Agora pour une session d'étude.
 * Se connecte automatiquement au mount, muté par défaut.
 *
 * Flux:
 * 1. Mount → fetch token depuis /api/voice/token
 * 2. Connexion à Agora avec le token
 * 3. Création du track audio (micro muté par défaut)
 * 4. Publication du track
 * 5. Écoute des autres participants
 * 6. Unmount → cleanup et déconnexion
 */

import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

// Désactiver les logs Agora en prod
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  AgoraRTC.setLogLevel(4); // ERROR only
}

export interface VoiceParticipant {
  odlUserId: string;
  odlUserName: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

interface UseVoiceChatOptions {
  sessionId: string;
  odlUserId: string;
  odlUserName: string;
  enabled?: boolean; // Permet de désactiver le voice (ex: session terminée)
}

interface UseVoiceChatReturn {
  /** Est connecté au channel voice */
  isConnected: boolean;
  /** Est en train de se connecter */
  isConnecting: boolean;
  /** Le micro local est muté */
  isMuted: boolean;
  /** Erreur de connexion */
  error: string | null;
  /** Toggle mute/unmute du micro */
  toggleMute: () => void;
  /** Liste des participants avec leur état */
  participants: VoiceParticipant[];
}

export function useVoiceChat({
  sessionId,
  odlUserId,
  odlUserName,
  enabled = true,
}: UseVoiceChatOptions): UseVoiceChatReturn {
  // État
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Muté par défaut
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);

  // Refs pour éviter les re-renders
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const uidRef = useRef<number>(0);

  // Map odlUserName par UID Agora (pour afficher les noms)
  const uidToUserRef = useRef<
    Map<number, { odlUserId: string; odlUserName: string }>
  >(new Map());

  /**
   * Initialise la connexion Agora
   */
  /**
   * Déconnexion propre
   */
  const disconnect = useCallback(async () => {
    // Capture refs locally to ensure we clean up specific instances
    const client = clientRef.current;
    const localTrack = localTrackRef.current;

    // Clear refs immediately to prevent race conditions with new connections
    clientRef.current = null;
    localTrackRef.current = null;

    // Fermer le track local
    if (localTrack) {
      localTrack.close();
    }

    // Quitter le channel
    if (client) {
      // D'abord retirer les listeners pour éviter les erreurs pendant le leave
      client.removeAllListeners();
      try {
        await client.leave();
      } catch (err) {
        console.error("Error leaving channel:", err);
      }
    }

    setIsConnected(false);
    setParticipants([]);
    console.log("👋 Voice disconnected");
  }, []);

  /**
   * Toggle mute/unmute
   */
  const toggleMute = useCallback(() => {
    if (!localTrackRef.current) return;

    const newMutedState = !isMuted;
    localTrackRef.current.setEnabled(!newMutedState);
    setIsMuted(newMutedState);

    // Mettre à jour notre état dans participants
    setParticipants((prev) =>
      prev.map((p) =>
        p.odlUserId === odlUserId ? { ...p, isMuted: newMutedState } : p
      )
    );
  }, [isMuted, odlUserId]);

  /**
   * Connexion au mount, déconnexion au unmount
   */
  useEffect(() => {
    let isCancelled = false;

    const connect = async () => {
      if (!sessionId || !enabled) return;
      
      setIsConnecting(true);
      setError(null);

      try {
        // 1. Récupérer le token depuis l'API
        const { data } = await axios.post("/api/voice/token", { sessionId });
        
        if (isCancelled) return;

        const { token, channel, uid, appId } = data.data;

        uidRef.current = uid;
        uidToUserRef.current.set(uid, { odlUserId, odlUserName });

        // 2. Créer le client Agora
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        
        if (isCancelled) return;
        clientRef.current = client;

        // 3. Setup des event listeners
        client.on(
          "user-published",
          async (user: IAgoraRTCRemoteUser, mediaType) => {
            if (isCancelled) return;
            if (mediaType === "audio") {
              await client.subscribe(user, mediaType);
              if (isCancelled) return;
              user.audioTrack?.play();

              setParticipants((prev) => {
                const existing = prev.find(
                  (p) => p.odlUserId === String(user.uid)
                );
                if (existing) return prev;

                const userInfo = uidToUserRef.current.get(user.uid as number);
                return [
                  ...prev,
                  {
                    odlUserId: String(user.uid),
                    odlUserName: userInfo?.odlUserName || `User ${user.uid}`,
                    isMuted: false,
                    isSpeaking: false,
                  },
                ];
              });
            }
          }
        );

        client.on("user-unpublished", (user: IAgoraRTCRemoteUser) => {
          setParticipants((prev) =>
            prev.filter((p) => p.odlUserId !== String(user.uid))
          );
        });

        client.on("user-left", (user: IAgoraRTCRemoteUser) => {
          setParticipants((prev) =>
            prev.filter((p) => p.odlUserId !== String(user.uid))
          );
        });

        // 4. Rejoindre le channel
        await client.join(appId, channel, token, uid);

        if (isCancelled) {
          await client.leave();
          clientRef.current = null;
          return;
        }

        // 5. Créer le track micro local
        const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
        
        if (isCancelled) {
          localTrack.close();
          await client.leave();
          clientRef.current = null;
          return;
        }

        localTrackRef.current = localTrack;
        localTrack.setEnabled(false); // Muté par défaut

        // 6. Publier le track
        await client.publish([localTrack]);

        if (isCancelled) {
            // Cleanup si annulé juste après publish
            localTrack.close();
            localTrackRef.current = null;
            await client.leave();
            clientRef.current = null;
            return;
        }

        setParticipants([
          {
            odlUserId,
            odlUserName,
            isMuted: true,
            isSpeaking: false,
          },
        ]);

        setIsConnected(true);
        console.log("✅ Voice connected to channel:", channel);
      } catch (err) {
        if (!isCancelled) {
          console.error("❌ Voice connection error:", err);
          setError("Impossible de se connecter au voice chat");
        }
      } finally {
        if (!isCancelled) {
          setIsConnecting(false);
        }
      }
    };

    connect();

    return () => {
      isCancelled = true;
      disconnect();
    };
  }, [sessionId, odlUserId, odlUserName, enabled, disconnect]);

  return {
    isConnected,
    isConnecting,
    isMuted,
    error,
    toggleMute,
    participants,
  };
}
