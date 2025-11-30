/**
 * Zod Validation Schemas
 * For API request validation and type-safe data handling
 */

import { z } from "zod";

// ============================================
// USER SCHEMAS
// ============================================

export const CreateUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
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
  "langue",
  "autre",
]);

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  tag: WorkspaceTagSchema.default("autre"),
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
// SESSION SCHEMAS
// ============================================

export const CreateSessionSchema = z.object({
  workspaceId: z.uuid("ID de workspace invalide"),
});

export const EndSessionSchema = z.object({
  sessionId: z.uuid("ID de session invalide"),
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
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export type WorkspaceTag = z.infer<typeof WorkspaceTagSchema>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
export type InviteToWorkspaceInput = z.infer<typeof InviteToWorkspaceSchema>;

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type EndSessionInput = z.infer<typeof EndSessionSchema>;

export type UploadFileInput = z.infer<typeof UploadFileSchema>;

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type WorkspaceFilterInput = z.infer<typeof WorkspaceFilterSchema>;
