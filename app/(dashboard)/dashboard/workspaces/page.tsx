"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { useWorkspaces } from "@/lib/stores/workspace-store";
import { FolderKanban, Plus, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const tagOptions = [
  { value: "all", label: "Toutes les matières" },
  { value: "maths", label: "Maths" },
  { value: "info", label: "Informatique" },
  { value: "physique", label: "Physique" },
  { value: "chimie", label: "Chimie" },
  { value: "svt", label: "SVT" },
  { value: "langues", label: "Langues" },
  { value: "droit", label: "Droit" },
  { value: "general", label: "Général" },
];

export default function WorkspacesPage() {
  // Use workspace store
  const {
    workspaces,
    pagination,
    isLoading,
    error,
    fetchWorkspaces,
    deleteWorkspace,
    joinWorkspace,
  } = useWorkspaces();

  // Local UI state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  // Fetch workspaces with server-side filtering and pagination
  useEffect(() => {
    const params: any = { page, limit: 20 };

    if (tagFilter !== "all") {
      params.tag = tagFilter;
    }

    if (search) {
      params.search = search;
    }

    fetchWorkspaces(params);
  }, [page, search, tagFilter, fetchWorkspaces]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when filter changes
  const handleTagFilterChange = (value: string) => {
    setTagFilter(value);
    setPage(1);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce workspace ?")) {
      return;
    }

    try {
      await deleteWorkspace(id);
    } catch (error) {
      console.error("Failed to delete workspace:", error);
    }
  };

  // Handle join workspace
  const handleJoin = async () => {
    setIsJoining(true);
    setJoinError("");

    try {
      await joinWorkspace(joinCode);
      setJoinCode("");
      setJoinDialogOpen(false);
    } catch (error: any) {
      setJoinError(error.message || "Impossible de rejoindre le workspace");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground">
            Gérez vos espaces de travail collaboratifs
          </p>
        </div>
        <div className="flex gap-2">
          {/* Join workspace dialog */}
          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Rejoindre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rejoindre un workspace</DialogTitle>
                <DialogDescription>
                  Entrez le code d'invitation pour rejoindre un workspace
                  existant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Code d'invitation</Label>
                  <Input
                    id="inviteCode"
                    placeholder="XXXXXXXX"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={8}
                    className="uppercase tracking-widest"
                  />
                </div>
                {joinError && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="text-sm text-error-500"
                  >
                    {joinError}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setJoinDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleJoin}
                  disabled={joinCode.length !== 8 || isJoining}
                >
                  {isJoining ? "Rejoindre..." : "Rejoindre"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create workspace */}
          <Link href="/dashboard/workspaces/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Rechercher un workspace..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tagFilter} onValueChange={handleTagFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrer par matière" />
          </SelectTrigger>
          <SelectContent>
            {tagOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Workspaces grid */}
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Chargement des workspaces en cours...</span>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : workspaces.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace, index) => (
            <div
              key={workspace.id}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <WorkspaceCard {...workspace} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : workspaces.length > 0 ? (
        // Has workspaces but none match filter
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md">
            <Search
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold">Aucun résultat</h3>
            <p className="mt-2 text-muted-foreground">
              Aucun workspace ne correspond à vos critères de recherche.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchInput("");
                setTagFilter("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </Card>
      ) : (
        // No workspaces at all
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
              Créez votre premier espace de révision collaboratif ou rejoignez
              un workspace existant.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Rejoindre
              </Button>
              <Link href="/dashboard/workspaces/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Créer un workspace
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Pagination controls */}
      {!isLoading &&
        workspaces.length > 0 &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} sur {pagination.totalPages} (
              {pagination.total} workspace{pagination.total > 1 ? "s" : ""})
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage}
                aria-label="Page précédente"
                aria-disabled={!pagination.hasPreviousPage}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                aria-label="Page suivante"
                aria-disabled={!pagination.hasNextPage}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
