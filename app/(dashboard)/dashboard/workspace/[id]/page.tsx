"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  Copy,
  FileText,
  MoreVertical,
  Pencil,
  Play,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkspaceData {
  id: string;
  name: string;
  description: string | null;
  tag: string;
  inviteCode: string;
  createdAt: string;
  userRole: "OWNER" | "MEMBER";
  members: Array<{
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  }>;
  sessions: Array<{
    id: string;
    title: string | null;
    startedAt: string;
    endedAt: string | null;
    duration: number | null;
    createdBy: {
      name: string;
    };
  }>;
  _count: {
    members: number;
    sessions: number;
    files: number;
  };
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

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const { data } = await axios.get(`/api/workspaces/${workspaceId}`);
        setWorkspace(data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Workspace introuvable");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspace();
  }, [workspaceId]);

  const handleCopyInviteCode = async () => {
    if (!workspace) return;
    await navigator.clipboard.writeText(workspace.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce workspace ?")) {
      return;
    }

    try {
      await axios.delete(`/api/workspaces/${workspaceId}`);
      router.push("/dashboard/workspaces");
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  };

  const handleStartSession = async () => {
    try {
      const { data } = await axios.post("/api/sessions", { workspaceId });
      // For now, just refresh - later this will open the collaborative canvas
      router.refresh();
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-error-500">{error}</p>
        <Link href="/dashboard/workspaces">
          <Button variant="outline" className="mt-4">
            Retour aux workspaces
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = workspace.userRole === "OWNER";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/dashboard/workspaces"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux workspaces
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl",
              tagColors[workspace.tag]?.split(" ")[0] || "bg-neutral-100"
            )}
          >
            📚
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{workspace.name}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  tagColors[workspace.tag] || tagColors.autre
                )}
              >
                {tagLabels[workspace.tag] || workspace.tag}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {workspace._count.members} membre
              {workspace._count.members > 1 ? "s" : ""} · {workspace._count.sessions}{" "}
              session{workspace._count.sessions > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Invite code */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopyInviteCode}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copié !" : workspace.inviteCode}
          </Button>

          {/* Start session */}
          <Button className="gap-2" onClick={handleStartSession}>
            <Play className="h-4 w-4" />
            Commencer une session
          </Button>

          {/* Actions (owner only) */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/workspace/${workspaceId}/settings`}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Paramètres
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Clock className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FileText className="h-4 w-4" />
            Fichiers
          </TabsTrigger>
        </TabsList>

        {/* Members tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Membres ({workspace._count.members})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspace.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={member.user.avatar || undefined}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {member.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={member.role === "OWNER" ? "default" : "secondary"}
                    >
                      {member.role === "OWNER" ? "Propriétaire" : "Membre"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Historique des sessions ({workspace._count.sessions})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workspace.sessions.length > 0 ? (
                <div className="space-y-3">
                  {workspace.sessions.map((session) => {
                    const startDate = new Date(session.startedAt);
                    const durationMinutes = session.duration
                      ? Math.round(session.duration / 60)
                      : null;

                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {session.title ||
                              `Session du ${startDate.toLocaleDateString("fr-FR")}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Par {session.createdBy.name} ·{" "}
                            {startDate.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {durationMinutes !== null && (
                          <Badge variant="secondary">
                            {durationMinutes < 60
                              ? `${durationMinutes} min`
                              : `${Math.floor(durationMinutes / 60)}h${durationMinutes % 60 > 0 ? ` ${durationMinutes % 60}min` : ""}`}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    Aucune session pour l'instant.
                  </p>
                  <Button className="mt-4 gap-2" onClick={handleStartSession}>
                    <Play className="h-4 w-4" />
                    Commencer une session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files tab */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Fichiers ({workspace._count.files})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Le système de fichiers sera bientôt disponible.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
