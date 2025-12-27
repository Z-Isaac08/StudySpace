"use client";

import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import { useStudySession } from "@/lib/hooks/use-study-session";
import { useWorkspaceDetail } from "@/lib/hooks/use-workspace";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Copy,
  FileText,
  Loader2,
  LogOut,
  MoreVertical,
  Play,
  Settings,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { user } = useAuth();
  const workspaceId = params.id as string;

  const {
    workspace,
    isLoading,
    error,
    fetchWorkspaceDetail,
    addMember: addMemberToWorkspace,
    removeMember: removeMemberFromWorkspace,
    updateMemberRole: updateMemberRoleInWorkspace,
    deleteWorkspace: deleteWorkspaceFromStore,
    clearCurrentWorkspace,
  } = useWorkspaceDetail();

  const {
    studySessions,
    isCreating: isCreatingSession,
    fetchStudySessions,
    createStudySession,
    deleteStudySession,
  } = useStudySession();

  const [copied, setCopied] = useState(false);

  // Add member dialog state
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");

  useEffect(() => {
    fetchWorkspaceDetail(workspaceId);
    fetchStudySessions(workspaceId);

    return () => {
      clearCurrentWorkspace();
    };
  }, [workspaceId, fetchWorkspaceDetail, fetchStudySessions, clearCurrentWorkspace]);

  const handleCopyInviteCode = async () => {
    if (!workspace) return;
    const inviteLink = `${window.location.origin}/invite/${workspace.inviteCode}`;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) {
      setAddMemberError("Veuillez entrer un email");
      return;
    }

    setAddMemberLoading(true);
    setAddMemberError("");

    try {
      await addMemberToWorkspace(workspaceId, memberEmail);
      toast.success("Membre ajouté avec succès");

      // Reset and close dialog
      setMemberEmail("");
      setAddMemberOpen(false);
    } catch (err: any) {
      setAddMemberError(
        err.response?.data?.error || "Impossible d'ajouter le membre"
      );
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir retirer ${userName} du workspace ?`)
    ) {
      return;
    }

    try {
      await removeMemberFromWorkspace(workspaceId, userId);
      toast.success("Membre retiré du workspace");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Impossible de retirer le membre"
      );
    }
  };

  const handleLeaveWorkspace = async () => {
    if (!user) return;

    if (
      !confirm(
        "Êtes-vous sûr de vouloir quitter ce workspace ? Vous devrez être réinvité pour le rejoindre à nouveau."
      )
    ) {
      return;
    }

    try {
      await removeMemberFromWorkspace(workspaceId, user.id);
      toast.success("Vous avez quitté le workspace");
      router.push("/dashboard/workspaces");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Impossible de quitter le workspace"
      );
    }
  };

  const handlePromoteToOwner = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir promouvoir ${userName} au rang de propriétaire ?`
      )
    ) {
      return;
    }

    try {
      await updateMemberRoleInWorkspace(workspaceId, userId, "OWNER");
      toast.success("Membre promu propriétaire");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Impossible de modifier le rôle"
      );
    }
  };

  const handleDemoteToMember = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir rétrograder ${userName} au rang de membre ?`
      )
    ) {
      return;
    }

    try {
      await updateMemberRoleInWorkspace(workspaceId, userId, "MEMBER");
      toast.success("Rôle modifié en membre");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Impossible de modifier le rôle"
      );
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce workspace ?")) {
      return;
    }

    try {
      await deleteWorkspaceFromStore(workspaceId);
      router.push("/dashboard/workspaces");
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  };

  const handleStartSession = async () => {
    try {
      const session = await createStudySession(workspaceId);
      // Redirect to session page
      router.push(`/dashboard/session/${session.id}`);
    } catch (err) {
      console.error("Failed to start session:", err);
      toast.error("Impossible de démarrer la session");
    }
  };

  // Find active session (not ended)
  const activeSession = studySessions.find((session) => !session.endedAt);

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

  if (error || (!isLoading && !workspace)) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-error-500">{error || "Workspace introuvable"}</p>
        <Link href="/dashboard/workspaces">
          <Button variant="outline" className="mt-4">
            Retour aux workspaces
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = workspace!.userRole === "OWNER";

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
              tagColors[workspace!.tag]?.split(" ")[0] || "bg-neutral-100"
            )}
          >
            📚
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{workspace!.name}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  tagColors[workspace!.tag] || tagColors.autre
                )}
              >
                {tagLabels[workspace!.tag] || workspace!.tag}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {workspace!._count.members} membre
              {workspace!._count.members > 1 ? "s" : ""} ·{" "}
              {workspace!._count.sessions} session
              {workspace!._count.sessions > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Invite link */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopyInviteCode}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Lien copié !" : "Copier le lien"}
          </Button>

          {/* Start session */}
          <Button
            className="gap-2"
            onClick={handleStartSession}
            disabled={isCreatingSession}
          >
            {isCreatingSession ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Commencer une session
              </>
            )}
          </Button>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <>
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
                </>
              )}
              {!isOwner && (
                <DropdownMenuItem
                  onClick={handleLeaveWorkspace}
                  className="text-error-500 focus:bg-error-50 focus:text-error-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Quitter le workspace
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Session en cours</p>
                <p className="text-sm text-muted-foreground">
                  Commencée il y a{" "}
                  {Math.floor(
                    (Date.now() - new Date(activeSession.startedAt).getTime()) /
                      60000
                  )}{" "}
                  min
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/dashboard/session/${activeSession.id}`}>
                Rejoindre
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">
                Membres ({workspace!._count.members})
              </CardTitle>
              {isOwner && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setAddMemberOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter un membre
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspace!.members.map((member) => {
                  const isSelf = user?.id === member.user.id;
                  const canManage = isOwner && !isSelf;

                  return (
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
                          <p className="font-medium">
                            {member.user.name}
                            {isSelf && (
                              <span className="ml-2 text-sm text-muted-foreground">
                                (vous)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            member.role === "OWNER" ? "default" : "secondary"
                          }
                        >
                          {member.role === "OWNER" ? "Propriétaire" : "Membre"}
                        </Badge>

                        {canManage && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {member.role === "MEMBER" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePromoteToOwner(
                                      member.user.id,
                                      member.user.name
                                    )
                                  }
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Promouvoir propriétaire
                                </DropdownMenuItem>
                              )}
                              {member.role === "OWNER" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDemoteToMember(
                                      member.user.id,
                                      member.user.name
                                    )
                                  }
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Rétrograder en membre
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRemoveMember(
                                    member.user.id,
                                    member.user.name
                                  )
                                }
                                className="text-error-500 focus:bg-error-50 focus:text-error-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Retirer du workspace
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Historique des sessions ({workspace!._count.sessions})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workspace!.studySessions.length > 0 ? (
                <div className="space-y-3">
                  {workspace!.studySessions.map((session) => {
                    const startDate = new Date(session.startedAt);
                    const endDate = session.endedAt
                      ? new Date(session.endedAt)
                      : null;
                    const durationMinutes = session.duration
                      ? Math.round(session.duration / 60)
                      : null;
                    const isActive = !session.endedAt;
                    const canDelete =
                      session.createdById === user?.id ||
                      workspace!.userRole === "OWNER";

                    return (
                      <Link
                        key={session.id}
                        href={`/dashboard/session/${session.id}`}
                        className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">
                                {session.title ||
                                  `Session du ${startDate.toLocaleDateString(
                                    "fr-FR"
                                  )}`}
                              </p>
                              {isActive && (
                                <Badge variant="default" className="shrink-0">
                                  En cours
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Par {session.createdBy.name} ·{" "}
                              {startDate.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {endDate && (
                                <>
                                  {" - "}
                                  {endDate.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {durationMinutes !== null && (
                              <Badge variant="secondary">
                                {durationMinutes < 60
                                  ? `${durationMinutes} min`
                                  : `${Math.floor(durationMinutes / 60)}h${
                                      durationMinutes % 60 > 0
                                        ? ` ${durationMinutes % 60}min`
                                        : ""
                                    }`}
                              </Badge>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (
                                    confirm(
                                      "Voulez-vous vraiment supprimer cette session ?"
                                    )
                                  ) {
                                    await deleteStudySession(session.id);
                                    toast.success(
                                      "Session supprimée avec succès"
                                    );
                                    // Refetch sessions only (no tab reset)
                                    fetchStudySessions(workspaceId);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Link>
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
                Fichiers ({workspace!._count.files})
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

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
            <DialogDescription>
              Entrez l'email d'un utilisateur inscrit pour l'ajouter à ce
              workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="utilisateur@example.com"
                value={memberEmail}
                onChange={(e) => {
                  setMemberEmail(e.target.value);
                  setAddMemberError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !addMemberLoading) {
                    handleAddMember();
                  }
                }}
                autoFocus
              />
            </div>

            {addMemberError && (
              <p className="text-sm text-error-500" role="alert">
                {addMemberError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddMemberOpen(false);
                setMemberEmail("");
                setAddMemberError("");
              }}
              disabled={addMemberLoading}
            >
              Annuler
            </Button>
            <Button onClick={handleAddMember} disabled={addMemberLoading}>
              {addMemberLoading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
