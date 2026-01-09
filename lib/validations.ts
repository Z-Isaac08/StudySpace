/**
 * Zod Validation Schemas
 * For API request validation and type-safe data handling
 */

import { z } from "zod";

// ============================================
// USER SCHEMAS
// ============================================

export const CreateUserSchema = z.object({
  email: z.email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export const LoginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const UpdateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères")
      .optional(),
    email: z.string().email("Email invalide").optional(),
  })
  .refine((data) => data.name || data.email, {
    message: "Vous devez modifier au moins un champ",
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
      .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// ============================================
// WORKSPACE SCHEMAS
// ============================================

export const WorkspaceTagSchema = z.enum([
  "maths",
  "info",
  "physique",
  "chimie",
  "svt",
  "langues",
  "droit",
  "general",
  "autre",
]);

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  tag: WorkspaceTagSchema,
});

export const UpdateWorkspaceSchema = z.object({
  name: z.string().min(3).optional(),
  tag: WorkspaceTagSchema.optional(),
});

export const InviteToWorkspaceSchema = z.object({
  inviteCode: z
    .string()
    .length(8, "Le code d'invitation doit contenir 8 caractères"),
});

// ============================================
// STUDY SESSION SCHEMAS
// ============================================

export const CreateStudySessionSchema = z.object({
  workspaceId: z.string().min(1, "ID de workspace requis"),
});

export const UpdateStudySessionSchema = z.object({
  canvasState: z.any().optional(), // JSON
  editorState: z.any().optional(), // JSON
});

export const EndStudySessionSchema = z.object({
  canvasState: z.any().optional(), // JSON
  editorState: z.any().optional(), // JSON
});

// ============================================
// FILE SCHEMAS
// ============================================

export const UploadFileSchema = z.object({
  workspaceId: z.uuid("ID de workspace invalide"),
  fileName: z.string().min(1, "Le nom du fichier est requis"),
  fileSize: z.number().max(50_000_000, "La taille maximale est de 50 MB"),
  mimeType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+]+$/i, "Type MIME invalide"),
});

export const SaveFileSchema = z.object({
  workspaceId: z.string().min(1, "ID de workspace requis"),
  name: z.string().min(1, "Le nom du fichier est requis"),
  url: z.string().url("URL invalide"),
  size: z.number().optional().default(0),
  mimeType: z.string().optional().default("application/octet-stream"),
});

// ============================================
// QUERY PARAMS SCHEMAS
// ============================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const WorkspaceFilterSchema = z.object({
  tag: WorkspaceTagSchema.optional(),
  search: z.string().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export type WorkspaceTag = z.infer<typeof WorkspaceTagSchema>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
export type InviteToWorkspaceInput = z.infer<typeof InviteToWorkspaceSchema>;

export type CreateStudySessionInput = z.infer<typeof CreateStudySessionSchema>;
export type UpdateStudySessionInput = z.infer<typeof UpdateStudySessionSchema>;
export type EndStudySessionInput = z.infer<typeof EndStudySessionSchema>;

export type UploadFileInput = z.infer<typeof UploadFileSchema>;
export type SaveFileInput = z.infer<typeof SaveFileSchema>;

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type WorkspaceFilterInput = z.infer<typeof WorkspaceFilterSchema>;
