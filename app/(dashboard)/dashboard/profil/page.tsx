"use client";

import { MotionDiv } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { UpdateProfileSchema, type UpdateProfileInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  BadgeX,
  CalendarDays,
  Edit,
  FileText,
  FolderKanban,
  Loader2,
  Mail,
  Timer,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfilPage() {
  const { user, isLoading, updateProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    workspaces: 0,
    sessions: 0,
    files: 0,
  });

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  // Fetch stats (mock for now - will be replaced with real API call)
  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      workspaces: 0,
      sessions: 0,
      files: 0,
    });
  }, []);

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile(data);
      toast.success("Profil mis à jour avec succès");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Mon profil
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Gérez vos informations personnelles
            </p>
          </div>
        </div>
      </MotionDiv>

      {/* Profile Card */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <CardTitle>Informations personnelles</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {initials}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-500" />
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">
                    {user.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {user.email}
                  </span>
                  {user.emailVerified ? (
                    <BadgeCheck className="h-4 w-4 text-success-600 dark:text-success-400" />
                  ) : (
                    <BadgeX className="h-4 w-4 text-error-600 dark:text-error-400" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-neutral-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Membre depuis{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Statistics */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Workspaces */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {stats.workspaces}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Espaces de travail
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {stats.sessions}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Sessions d'étude
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-info-100 dark:bg-info-900/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-info-600 dark:text-info-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {stats.files}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Fichiers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MotionDiv>

      {/* Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
            <DialogDescription>
              Mettez à jour vos informations personnelles
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre.email@exemple.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
