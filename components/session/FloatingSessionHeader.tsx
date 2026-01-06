"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionMember } from "@/lib/hooks/use-session-presence";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  FolderOpen,
  Loader2,
  LogOut,
  NotebookPen,
  Save,
  Square,
} from "lucide-react";
import Link from "next/link";
import { SessionPresenceAvatars } from "./SessionPresenceAvatars";

interface FloatingSessionHeaderProps {
  workspaceId: string;
  workspaceName: string;
  workspaceTag?: string;
  duration: string;
  members: SessionMember[];
  currentUserId: string;
  isEnded: boolean;
  isSaving: boolean;
  isEnding: boolean;
  isNotesOpen: boolean;
  isFilesOpen: boolean;
  onSave: () => void;
  onQuit: () => void;
  onTerminate: () => void;
  onToggleNotes: () => void;
  onToggleFiles: () => void;
}

// Tag accent colors for the header border
const tagAccentColors: Record<string, string> = {
  maths: "border-tag-maths/50",
  info: "border-tag-info/50",
  physique: "border-tag-physique/50",
  chimie: "border-tag-chimie/50",
  svt: "border-success/50",
  langues: "border-tag-langues/50",
  droit: "border-tag-droit/50",
  general: "border-tag-general/50",
  autre: "border-neutral-400/50",
};

// Tag dot colors
const tagDotColors: Record<string, string> = {
  maths: "bg-tag-maths",
  info: "bg-tag-info",
  physique: "bg-tag-physique",
  chimie: "bg-tag-chimie",
  svt: "bg-success",
  langues: "bg-tag-langues",
  droit: "bg-tag-droit",
  general: "bg-tag-general",
  autre: "bg-neutral-400",
};

export function FloatingSessionHeader({
  workspaceId,
  workspaceName,
  workspaceTag,
  duration,
  members,
  currentUserId,
  isEnded,
  isSaving,
  isEnding,
  isNotesOpen,
  isFilesOpen,
  onSave,
  onQuit,
  onTerminate,
  onToggleNotes,
  onToggleFiles,
}: FloatingSessionHeaderProps) {
  const accentColor = workspaceTag ? tagAccentColors[workspaceTag] : "";
  const dotColor = workspaceTag ? tagDotColors[workspaceTag] : "";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center p-3">
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-full",
            "border-2 bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md",
            "transition-all duration-200",
            accentColor || "border-border"
          )}
        >
          {/* Back button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/workspace/${workspaceId}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Retour au workspace</TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border" />

          {/* Workspace name & duration */}
          <div className="flex items-center gap-2 px-2">
            {dotColor && (
              <span className={cn("h-2 w-2 rounded-full", dotColor)} />
            )}
            <span className="max-w-40 truncate text-sm font-medium">
              {workspaceName}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            {isEnded && (
              <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">
                Terminée
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border" />

          {/* Session members */}
          <div className="px-1">
            <SessionPresenceAvatars
              members={members}
              currentUserId={currentUserId}
              maxVisible={4}
            />
          </div>

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border" />

          {/* Files button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  isFilesOpen && "bg-accent text-accent-foreground"
                )}
                onClick={onToggleFiles}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFilesOpen ? "Fermer les fichiers" : "Fichiers du workspace"}
            </TooltipContent>
          </Tooltip>

          {/* Notes button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  isNotesOpen && "bg-accent text-accent-foreground"
                )}
                onClick={onToggleNotes}
              >
                <NotebookPen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isNotesOpen ? "Fermer mes notes" : "Mes notes privées"}
            </TooltipContent>
          </Tooltip>

          {/* Actions */}
          {!isEnded && (
            <>
              {/* Divider */}
              <div className="mx-1 h-5 w-px bg-border" />

              <div className="flex items-center gap-1">
                {/* Saving indicator */}
                {isSaving && (
                  <div className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                )}

                {/* Save button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={onSave}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sauvegarder</TooltipContent>
                </Tooltip>

                {/* Quit button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={onQuit}
                      disabled={isEnding}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Quitter la session</TooltipContent>
                </Tooltip>

                {/* Terminate button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={onTerminate}
                      disabled={isEnding}
                    >
                      {isEnding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Terminer la session</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
