"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/stores/auth-store";
import { Clock, FolderKanban, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await axios.get("/api/workspaces");
        const workspaces = data.data || [];

        const totalMembers = workspaces.reduce(
          (acc: number, w: any) => acc + (w._count?.members || 0),
          0
        );
        const totalSessions = workspaces.reduce(
          (acc: number, w: any) => acc + (w._count?.sessions || 0),
          0
        );

        setStats({
          totalWorkspaces: workspaces.length,
          totalMembers,
          totalSessions,
          recentWorkspaces: workspaces.slice(0, 3),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workspaces
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats?.totalWorkspaces || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Espaces de travail actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collaborateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats?.totalMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Membres dans vos workspaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats?.totalSessions || 0}
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

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
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
              >
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center bg-tag-${workspace.tag}/10`}
                      >
                        <FolderKanban
                          className={`h-5 w-5 text-tag-${workspace.tag}`}
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
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
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
                  <Plus className="h-4 w-4" />
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
