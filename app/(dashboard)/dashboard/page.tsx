"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";
import { useWorkspaces } from "@/lib/hooks/use-workspace";
import { Clock, FolderKanban, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WorkspaceStats {
  totalWorkspaces: number;
  totalMembers: number;
  totalSessions: number;
  recentWorkspaces: Array<{
    id: string;
    name: string;
    tag: string;
    _count: {
      members: number;
      sessions: number;
    };
  }>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    workspaces,
    pagination,
    isLoading: workspacesLoading,
    fetchWorkspaces,
  } = useWorkspaces();
  const [stats, setStats] = useState<WorkspaceStats | null>(null);

  useEffect(() => {
    // Fetch workspaces with high limit for stats
    fetchWorkspaces({ limit: 100 });
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (!workspacesLoading && workspaces.length >= 0) {
      const totalMembers = workspaces.reduce(
        (acc, w) => acc + (w._count?.members || 0),
        0
      );
      const totalSessions = workspaces.reduce(
        (acc, w) => acc + (w._count?.sessions || 0),
        0
      );

      setStats({
        totalWorkspaces: pagination?.total || workspaces.length,
        totalMembers,
        totalSessions,
        recentWorkspaces: workspaces.slice(0, 3),
      });
    }
  }, [workspaces, workspacesLoading, pagination]);

  const firstName = user?.name?.split(" ")[0] || "utilisateur";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, {firstName} !</h1>
        <p className="mt-1 text-muted-foreground">
          Voici un aperçu de vos espaces de travail collaboratifs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workspaces
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <FolderKanban
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
              {workspacesLoading ? "-" : stats?.totalWorkspaces || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Espaces de travail actifs
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-success/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collaborateurs
            </CardTitle>
            <div className="rounded-lg bg-success/10 p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Users className="h-4 w-4 text-success" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
              {workspacesLoading ? "-" : stats?.totalMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Membres dans vos workspaces
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-info/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions
            </CardTitle>
            <div className="rounded-lg bg-info/10 p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Clock className="h-4 w-4 text-info" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
              {workspacesLoading ? "-" : stats?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sessions de révision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workspaces or Empty State */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Workspaces récents</h2>
          <Link href="/dashboard/workspaces">
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </Link>
        </div>

        {workspacesLoading ? (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="grid gap-4 md:grid-cols-3"
          >
            <span className="sr-only">
              Chargement des workspaces en cours...
            </span>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-24 rounded bg-muted"></div>
                  <div className="mt-4 h-3 w-32 rounded bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats?.recentWorkspaces && stats.recentWorkspaces.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {stats.recentWorkspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/dashboard/workspace/${workspace.id}`}
                className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center bg-tag-${workspace.tag}/10`}
                      >
                        <FolderKanban
                          className={`h-5 w-5 text-tag-${workspace.tag}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workspace.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {workspace._count.members} membre
                          {workspace._count.members > 1 ? "s" : ""} ·{" "}
                          {workspace._count.sessions} session
                          {workspace._count.sessions > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FolderKanban
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold">
                Aucun workspace pour l'instant
              </h3>
              <p className="mt-2 text-muted-foreground">
                Créez votre premier espace de révision collaboratif pour
                commencer !
              </p>
              <Link href="/dashboard/workspaces/new">
                <Button className="mt-6 gap-2">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Créer un workspace
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
