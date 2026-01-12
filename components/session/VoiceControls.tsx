"use client";

/**
 * VoiceControls Component
 *
 * Affiche le bouton mute/unmute et l'indicateur de connexion voice.
 * Intégré dans le FloatingSessionHeader.
 */

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Loader2, WifiOff } from "lucide-react";

interface VoiceControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  error: string | null;
  onToggleMute: () => void;
}

export function VoiceControls({
  isConnected,
  isConnecting,
  isMuted,
  error,
  onToggleMute,
}: VoiceControlsProps) {
  // En cours de connexion
  if (isConnecting) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Connexion au vocal...</TooltipContent>
      </Tooltip>
    );
  }

  // Erreur de connexion
  if (error || !isConnected) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground"
            disabled
          >
            <WifiOff className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {error || "Vocal non disponible"}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Connecté - afficher le toggle mute
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-colors",
            isMuted
              ? "text-muted-foreground hover:text-foreground"
              : "bg-green-500/20 text-green-600 hover:bg-green-500/30"
          )}
          onClick={onToggleMute}
        >
          {isMuted ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isMuted ? "Activer le micro" : "Couper le micro"}
      </TooltipContent>
    </Tooltip>
  );
}
