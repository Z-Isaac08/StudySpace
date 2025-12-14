"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateWorkspaceInput, CreateWorkspaceSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Atom,
  Calculator,
  Code2,
  FlaskRound as Flask,
  FolderKanban,
  Languages,
  Leaf,
  Loader2,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const tagOptions: Array<{ value: string; label: string; Icon: LucideIcon }> = [
  { value: "maths", label: "Mathématiques", Icon: Calculator },
  { value: "info", label: "Informatique", Icon: Code2 },
  { value: "physique", label: "Physique", Icon: Atom },
  { value: "chimie", label: "Chimie", Icon: Flask },
  { value: "svt", label: "SVT", Icon: Leaf },
  { value: "langues", label: "Langues", Icon: Languages },
  { value: "droit", label: "Droit", Icon: Scale },
  { value: "general", label: "Général", Icon: FolderKanban },
];

export default function NewWorkspacePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
      tag: "general",
    },
  });

  async function onSubmit(data: CreateWorkspaceInput) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post("/api/workspaces", data);
      const workspace = response.data.data;
      router.push(`/dashboard/workspace/${workspace.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Impossible de créer le workspace");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back button */}
      <Link
        href="/dashboard/workspaces"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux workspaces
      </Link>

      {/* Form card */}
      <Card>
        <CardHeader>
          <CardTitle>Créer un workspace</CardTitle>
          <CardDescription>
            Créez un nouvel espace de travail collaboratif pour réviser avec vos
            camarades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du workspace</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Révisions Maths Terminale"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choisissez un nom descriptif pour votre espace de travail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tag field */}
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matière</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tagOptions.map((option) => {
                          const Icon = option.Icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      La matière principale de ce workspace.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Créer le workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border-info/20 bg-info-50/50">
        <CardContent className="flex gap-4 pt-6">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium">Comment ça marche ?</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Une fois créé, vous pourrez inviter vos camarades avec un code
              d'invitation unique. Ensemble, vous pourrez dessiner sur un
              tableau blanc collaboratif, prendre des notes en temps réel et
              discuter en vidéo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
