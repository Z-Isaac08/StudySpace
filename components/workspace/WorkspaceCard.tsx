"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Clock,
  Copy,
  FolderKanban,
  MoreVertical,
  Pencil,
  Play,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface WorkspaceCardProps {
  id: string;
  name: string;
  tag: string;
  inviteCode: string;
  userRole: "OWNER" | "MEMBER";
  _count: {
    members: number;
    sessions: number;
    files: number;
  };
  onDelete?: (id: string) => void;
}

const tagLabels: Record<string, string> = {
  maths: "Maths",
  info: "Informatique",
  physique: "Physique",
  chimie: "Chimie",
  svt: "SVT",
  langues: "Langues",
  droit: "Droit",
  general: "Général",
  autre: "Autre",
};

const tagColors: Record<string, string> = {
  maths: "bg-tag-maths/10 text-tag-maths border-tag-maths/20",
  info: "bg-tag-info/10 text-tag-info border-tag-info/20",
  physique: "bg-tag-physique/10 text-tag-physique border-tag-physique/20",
  chimie: "bg-tag-chimie/10 text-tag-chimie border-tag-chimie/20",
  svt: "bg-success/10 text-success border-success/20",
  langues: "bg-tag-langues/10 text-tag-langues border-tag-langues/20",
  droit: "bg-tag-droit/10 text-tag-droit border-tag-droit/20",
  general: "bg-tag-general/10 text-tag-general border-tag-general/20",
  autre: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function WorkspaceCard({
  id,
  name,
  tag,
  inviteCode,
  userRole,
  _count,
  onDelete,
}: WorkspaceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: `var(--tag-${tag})` }}>
      {/* Background gradient effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Tag badge */}
      <div className="absolute right-3 top-3 z-10">
        <Badge
          variant="outline"
          className={cn("text-xs font-medium transition-all duration-200 group-hover:scale-105", tagColors[tag] || tagColors.autre)}
        >
          {tagLabels[tag] || tag}
        </Badge>
      </div>

      <CardContent className="pt-6 relative z-10">
        <div className="flex items-start gap-4">
          {/* Icon with animated background */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              tagColors[tag]?.split(" ")[0] || "bg-neutral-100"
            )}
          >
            <FolderKanban className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 pr-8">
            <Link href={`/dashboard/workspace/${id}`}>
              <h3 className="truncate text-lg font-semibold hover:text-primary transition-colors duration-200">
                {name}
              </h3>
            </Link>

            {/* Stats with animated icons */}
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 transition-colors duration-200 group-hover:text-foreground">
                <Users className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {_count.members} membre{_count.members > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 transition-colors duration-200 group-hover:text-foreground">
                <Clock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {_count.sessions} session{_count.sessions > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t pt-4 relative z-10">
        {/* Invite code with copy animation */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 text-xs text-muted-foreground transition-all duration-200",
            copied && "text-success-500"
          )}
          onClick={handleCopyInviteCode}
        >
          <Copy className={cn("h-3 w-3 transition-transform duration-200", copied && "scale-125")} />
          {copied ? "Copié !" : inviteCode}
        </Button>

        <div className="flex items-center gap-2">
          {/* Start session button with hover effect */}
          <Link href={`/dashboard/workspace/${id}`}>
            <Button size="sm" className="gap-2 group/btn">
              <Play className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
              Ouvrir
            </Button>
          </Link>

          {/* Actions dropdown (owner only) */}
          {userRole === "OWNER" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:rotate-90 transition-transform duration-300">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/workspace/${id}/settings`}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-error-500 focus:bg-error-50 focus:text-error-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
