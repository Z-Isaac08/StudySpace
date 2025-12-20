"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/stores/auth-store";
import axios from "axios";
import { CheckCircle, FolderKanban, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type JoinStatus = "loading" | "success" | "error" | "already_member";

interface WorkspacePreview {
  id: string;
  name: string;
  tag: string;
  _count: {
    members: number;
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
  general: "G�n�ral",
  autre: "Autre",
};

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const inviteCode = (params.code as string).toUpperCase();

  const [status, setStatus] = useState<JoinStatus>("loading");
  const [workspace, setWorkspace] = useState<WorkspacePreview | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function handleInvite() {
      // Wait for auth to be determined
      if (authLoading) {
        return;
      }

      // If not authenticated, redirect to login with invite code
      if (!isAuthenticated) {
        router.push(`/login?inviteCode=${inviteCode}`);
        return;
      }

      // User is authenticated, try to join
      try {
        setStatus("loading");
        const { data } = await axios.post("/api/workspaces/join", {
          inviteCode,
        });

        setWorkspace(data.data);
        setStatus("success");

        // Redirect to workspace after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/workspace/${data.data.id}`);
        }, 2000);
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || "Erreur inconnue";

        // Check if already member
        if (errorMsg.includes("d�j� membre")) {
          setStatus("already_member");
          // Try to extract workspace info from error or fetch it
          // For now, redirect to workspaces list
          setTimeout(() => {
            router.push("/dashboard/workspaces");
          }, 2000);
        } else {
          setStatus("error");
          setErrorMessage(errorMsg);
        }
      }
    }

    handleInvite();
  }, [inviteCode, isAuthenticated, authLoading, router]);

  // Loading state
  if (authLoading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              Traitement de l'invitation...
            </h1>
            <p className="text-muted-foreground">
              Veuillez patienter un instant
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Success state
  if (status === "success" && workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle
                className="h-8 w-8 text-success"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl font-bold">Bienvenue !</h1>
            <p className="text-muted-foreground">
              Vous avez rejoint le workspace avec succ�s
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FolderKanban
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold">{workspace.name}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {tagLabels[workspace.tag] || workspace.tag} �{" "}
                {workspace._count.members} membre
                {workspace._count.members > 1 ? "s" : ""}
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Redirection en cours...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already member state
  if (status === "already_member") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-info/10">
              <CheckCircle className="h-8 w-8 text-info" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold">D�j� membre</h1>
            <p className="text-muted-foreground">
              Vous �tes d�j� membre de ce workspace
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Redirection vers vos workspaces...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <XCircle className="h-8 w-8 text-error" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">Invitation invalide</h1>
          <p className="text-muted-foreground">{errorMessage}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/dashboard/workspaces">Retour aux workspaces</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Retour au dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
