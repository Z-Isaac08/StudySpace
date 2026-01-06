"use client";

import { MotionDiv } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/types";
import {
    ChangePasswordSchema,
    UpdateProfileSchema,
    type ChangePasswordInput,
    type UpdateProfileInput,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    AlertTriangle,
    BadgeCheck,
    BadgeX,
    Loader2,
    LockKeyhole,
    Mail,
    RefreshCw,
    Shield,
    Trash2,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ParametresPage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, changePassword, sendVerificationEmail, deleteAccount } = useAuth();
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  // Profile form
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);

  // Delete account modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Update profile form when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile(data);
      toast.success("Profil mis à jour avec succès");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Erreur lors de la mise à jour du profil");
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword(data.currentPassword, data.newPassword, revokeOtherSessions);
      toast.success("Mot de passe modifié avec succès");
      passwordForm.reset();
      setRevokeOtherSessions(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Erreur lors du changement de mot de passe");
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setIsResendingVerification(true);
    try {
      await sendVerificationEmail(user.email);
      toast.success("Email de vérification renvoyé");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Erreur lors de l'envoi de l'email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Compte supprimé avec succès");
      // Redirect to landing page after deletion
      router.push("/");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteConfirmName("");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Paramètres
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Gérez votre compte et vos préférences
          </p>
        </div>
      </MotionDiv>

      {/* Settings Tabs */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs defaultValue="compte" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compte">Compte</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
            <TabsTrigger value="danger">Zone de danger</TabsTrigger>
          </TabsList>

          {/* Compte Tab */}
          <TabsContent value="compte" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-neutral-500" />
                  <CardTitle>Informations personnelles</CardTitle>
                </div>
                <CardDescription>
                  Mettez à jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
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
                      control={profileForm.control}
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

                    <Button
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      {profileForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        "Enregistrer les modifications"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Email Verification Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-neutral-500" />
                  <CardTitle>Vérification de l'email</CardTitle>
                </div>
                <CardDescription>
                  Statut de vérification de votre adresse email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.emailVerified ? (
                  <Alert variant="success">
                    <BadgeCheck className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      Votre adresse email est vérifiée
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert variant="destructive">
                      <BadgeX className="h-4 w-4" />
                      <AlertDescription className="ml-2">
                        Votre adresse email n'est pas encore vérifiée
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                    >
                      {isResendingVerification ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Renvoyer l'email de vérification
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité Tab */}
          <TabsContent value="securite" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-5 w-5 text-neutral-500" />
                  <CardTitle>Changer le mot de passe</CardTitle>
                </div>
                <CardDescription>
                  Mettez à jour votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 8 caractères
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="revokeOtherSessions"
                        checked={revokeOtherSessions}
                        onCheckedChange={(checked) =>
                          setRevokeOtherSessions(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="revokeOtherSessions"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Déconnecter tous les autres appareils
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                    >
                      {passwordForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changement en cours...
                        </>
                      ) : (
                        "Changer le mot de passe"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-neutral-500" />
                  <CardTitle>Recommandations de sécurité</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Utilisez un mot de passe fort et unique</li>
                      <li>Ne partagez jamais votre mot de passe</li>
                      <li>Changez régulièrement votre mot de passe</li>
                      <li>Vérifiez toujours votre adresse email</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zone de danger Tab */}
          <TabsContent value="danger" className="space-y-6">
            <Card className="border-error-200 dark:border-error-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400" />
                  <CardTitle className="text-error-900 dark:text-error-100">
                    Supprimer mon compte
                  </CardTitle>
                </div>
                <CardDescription>
                  Cette action est irréversible. Toutes vos données seront
                  définitivement supprimées.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong className="font-semibold">Attention :</strong> La
                    suppression de votre compte entraînera la perte permanente de :
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Vos informations personnelles</li>
                      <li>Tous vos espaces de travail</li>
                      <li>Vos sessions d'étude</li>
                      <li>Vos fichiers uploadés</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement mon compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </MotionDiv>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-error-900 dark:text-error-100">
              <AlertTriangle className="h-5 w-5" />
              Supprimer votre compte
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Veuillez confirmer en tapant votre nom
              complet ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Votre compte <strong>{user?.email}</strong> et toutes les données
                associées seront définitivement supprimés.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label
                htmlFor="confirm-name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tapez <strong>{user?.name}</strong> pour confirmer
              </label>
              <Input
                id="confirm-name"
                type="text"
                placeholder={user?.name}
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteConfirmName("");
              }}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmName !== user?.name || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
