# Task 6 : Upload et Gestion de Fichiers (Phase 4)

**Statut** : 🔜 À faire
**Priorité** : Basse
**Estimation** : 2-3 semaines
**Phase** : Phase 4 - Fichiers & Ressources

---

## Objectif

Permettre aux utilisateurs d'uploader, stocker et partager des fichiers (PDF, images, documents) dans les workspaces avec stockage Supabase Storage.

---

## Sous-tâches

### 6.1 Setup Supabase Storage

- [ ] **Créer bucket dans Supabase**
  - Supabase Dashboard → Storage → New Bucket
  - Nom : `workspace-files`
  - Public : `false` (files privés)

- [ ] **Configurer RLS (Row Level Security)**
  ```sql
  -- Policy : Lecture si membre du workspace
  CREATE POLICY "Users can read workspace files"
  ON storage.objects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN files f ON f.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()
        AND bucket_id = 'workspace-files'
        AND name = f.url
    )
  );

  -- Policy : Upload si membre du workspace
  CREATE POLICY "Users can upload to their workspaces"
  ON storage.objects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = (storage.foldername(name))::uuid
        AND user_id = auth.uid()
    )
  );
  ```

- [ ] **Limiter taille fichiers**
  - Supabase Dashboard → Storage Settings
  - Max file size : 50 MB (ajustable)

### 6.2 Créer API routes Files

- [ ] **POST /api/files** - Upload file
  ```typescript
  import { createClient } from '@/lib/supabase/server';
  import { getCurrentUser } from '@/lib/auth/session';
  import prisma from '@/lib/prisma';

  export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const workspaceId = formData.get('workspaceId') as string;

    // Check membership
    const isMember = await isWorkspaceMember(user.id, workspaceId);
    if (!isMember) return forbiddenResponse();

    // Upload to Supabase Storage
    const supabase = await createClient();
    const fileName = `${workspaceId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('workspace-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return errorResponse('Upload échoué', 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('workspace-files')
      .getPublicUrl(fileName);

    // Save metadata in Prisma
    const fileRecord = await prisma.file.create({
      data: {
        workspaceId,
        uploadedById: user.id,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        url: fileName, // Store path, not full URL
      },
    });

    return successResponse(fileRecord, 201);
  }
  ```

- [ ] **GET /api/files?workspaceId=...** - List files
  ```typescript
  export async function GET(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return errorResponse('workspaceId requis', 400);
    }

    const isMember = await isWorkspaceMember(user.id, workspaceId);
    if (!isMember) return forbiddenResponse();

    const files = await prisma.file.findMany({
      where: { workspaceId },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { uploadedAt: 'desc' },
      take: 100,
    });

    return successResponse(files);
  }
  ```

- [ ] **DELETE /api/files/[id]** - Delete file
  ```typescript
  export async function DELETE(request, { params }) {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;

    const file = await prisma.file.findUnique({
      where: { id },
      include: { workspace: true },
    });

    if (!file) {
      return errorResponse('Fichier non trouvé', 404);
    }

    // Check if uploader or workspace owner
    const isOwner = await isWorkspaceOwner(user.id, file.workspaceId);
    if (file.uploadedById !== user.id && !isOwner) {
      return forbiddenResponse('Seul l\'uploader ou le propriétaire peut supprimer');
    }

    // Delete from Supabase Storage
    const supabase = await createClient();
    await supabase.storage
      .from('workspace-files')
      .remove([file.url]);

    // Delete from Prisma
    await prisma.file.delete({ where: { id } });

    return successResponse({ message: 'Fichier supprimé' });
  }
  ```

### 6.3 Créer File Store

- [ ] **Créer file-store.ts** (`lib/stores/file-store.ts`)
  ```typescript
  import { create } from 'zustand';
  import axios from 'axios';

  interface File {
    id: string;
    workspaceId: string;
    uploadedById: string;
    name: string;
    size: number;
    mimeType: string;
    url: string;
    uploadedAt: string;
    uploadedBy: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface FileState {
    files: File[];
    isLoading: boolean;
    isUploading: boolean;
    error: string | null;
    uploadProgress: number;

    fetchFiles: (workspaceId: string) => Promise<void>;
    uploadFile: (workspaceId: string, file: File) => Promise<File>;
    deleteFile: (fileId: string) => Promise<void>;
    clearError: () => void;
  }

  export const useFileStore = create<FileState>()((set, get) => ({
    files: [],
    isLoading: false,
    isUploading: false,
    error: null,
    uploadProgress: 0,

    fetchFiles: async (workspaceId) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await axios.get(`/api/files?workspaceId=${workspaceId}`);
        set({ files: data.data, isLoading: false });
      } catch (error: any) {
        set({ error: error.response?.data?.error, isLoading: false });
      }
    },

    uploadFile: async (workspaceId, file) => {
      set({ isUploading: true, error: null, uploadProgress: 0 });
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('workspaceId', workspaceId);

        const { data } = await axios.post('/api/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            set({ uploadProgress: progress });
          },
        });

        const newFile = data.data;
        set({
          files: [newFile, ...get().files],
          isUploading: false,
          uploadProgress: 0,
        });
        return newFile;
      } catch (error: any) {
        set({ error: error.response?.data?.error, isUploading: false });
        throw error;
      }
    },

    deleteFile: async (fileId) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`/api/files/${fileId}`);
        set({
          files: get().files.filter((f) => f.id !== fileId),
          isLoading: false,
        });
      } catch (error: any) {
        set({ error: error.response?.data?.error, isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  }));

  export const useFiles = () => useFileStore();
  ```

### 6.4 Créer UI Upload

- [ ] **Créer FileUpload component** (`components/FileUpload.tsx`)
  ```typescript
  'use client';
  import { useCallback } from 'react';
  import { useDropzone } from 'react-dropzone';
  import { useFiles } from '@/lib/stores/file-store';
  import { UploadIcon } from 'lucide-react';
  import { Progress } from '@/components/ui/progress';

  export default function FileUpload({ workspaceId }) {
    const { uploadFile, isUploading, uploadProgress } = useFiles();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          await uploadFile(workspaceId, file);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }, [workspaceId, uploadFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxSize: 50 * 1024 * 1024, // 50 MB
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        'application/pdf': ['.pdf'],
        'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      },
    });

    return (
      <div>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Déposez le fichier ici...'
              : 'Glissez-déposez un fichier, ou cliquez pour sélectionner'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PDF, Images, DOCX, PPTX (max 50 MB)
          </p>
        </div>

        {isUploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Upload en cours... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Installer react-dropzone**
  ```bash
  npm install react-dropzone
  ```

### 6.5 Créer File List

- [ ] **Créer FileList component** (`components/FileList.tsx`)
  ```typescript
  'use client';
  import { useEffect } from 'react';
  import { useFiles } from '@/lib/stores/file-store';
  import { FileIcon, TrashIcon, DownloadIcon } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { formatBytes } from '@/lib/utils';

  export default function FileList({ workspaceId }) {
    const { files, isLoading, fetchFiles, deleteFile } = useFiles();

    useEffect(() => {
      fetchFiles(workspaceId);
    }, [workspaceId, fetchFiles]);

    const handleDownload = (file) => {
      // Generate signed URL (Supabase Storage)
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/workspace-files/${file.url}`;
      window.open(url, '_blank');
    };

    if (isLoading) {
      return <div>Chargement...</div>;
    }

    if (files.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucun fichier partagé pour le moment
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatBytes(file.size)} • Uploadé par {file.uploadedBy.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file)}
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteFile(file.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  ```

- [ ] **Ajouter formatBytes helper** (`lib/utils.ts`)
  ```typescript
  export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  ```

### 6.6 Intégrer dans Workspace Detail

- [ ] **Ajouter tab "Fichiers"** dans workspace detail
  ```typescript
  // app/(dashboard)/dashboard/workspace/[id]/page.tsx

  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
      <TabsTrigger value="sessions">Sessions</TabsTrigger>
      <TabsTrigger value="members">Membres</TabsTrigger>
      <TabsTrigger value="files">Fichiers</TabsTrigger>  {/* NEW */}
    </TabsList>

    <TabsContent value="files">
      <Card>
        <CardHeader>
          <CardTitle>Fichiers partagés</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload workspaceId={workspaceId} />
          <div className="mt-6">
            <FileList workspaceId={workspaceId} />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
  ```

### 6.7 File Viewer (Optionnel)

- [ ] **PDF Viewer** avec react-pdf
  ```bash
  npm install react-pdf
  ```

  ```typescript
  import { Document, Page } from 'react-pdf';

  <Dialog open={isPDFOpen} onOpenChange={setIsPDFOpen}>
    <DialogContent className="max-w-4xl">
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </DialogContent>
  </Dialog>
  ```

- [ ] **Image Viewer** avec lightbox
  ```bash
  npm install yet-another-react-lightbox
  ```

### 6.8 Validation & Sécurité

- [ ] **Validation fichiers côté serveur**
  - Vérifier MIME type
  - Limiter taille (50 MB)
  - Bloquer types dangereux (.exe, .sh, .bat)

  ```typescript
  const ALLOWED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return errorResponse('Type de fichier non autorisé', 400);
  }

  if (file.size > 50 * 1024 * 1024) {
    return errorResponse('Fichier trop volumineux (max 50 MB)', 400);
  }
  ```

- [ ] **Scan antivirus** (optionnel - Phase 5)
  - Intégration ClamAV ou VirusTotal API

### 6.9 Tests

- [ ] **Upload fichier**
  - PDF, image, DOCX
  - Vérifier apparition dans liste

- [ ] **Download fichier**
  - Clic download → fichier téléchargé

- [ ] **Delete fichier**
  - Propriétaire peut supprimer
  - Non-propriétaire ne peut pas (403)

- [ ] **Permissions**
  - Non-membre ne peut pas upload/download (403)

- [ ] **Progress bar**
  - Upload gros fichier (10+ MB)
  - Vérifier progress bar fonctionne

---

## Critères d'acceptation

- ✅ Upload fichiers (drag & drop + click)
- ✅ Liste des fichiers avec nom, taille, uploader
- ✅ Download fichiers
- ✅ Delete fichiers (uploader ou owner)
- ✅ Progress bar pendant upload
- ✅ Validation MIME type et taille
- ✅ Permissions vérifiées (RLS)
- ✅ UI intégrée dans workspace detail
- ✅ Support PDF, images, DOCX, PPTX

---

## Dépendances

- ✅ MVP Phase 3A terminé

---

## Risques

- **Quota Supabase dépassé** : Free tier = 1 GB storage
  - Mitigation : Monitor usage, upgrade plan ($25/mois)
- **Upload fichiers volumineux lent** : 50 MB peut prendre 1-2 min
  - Mitigation : Progress bar, compression images
- **Malware upload** : Utilisateur upload fichier malveillant
  - Mitigation : Validation MIME type, antivirus scan (Phase 5)

---

## Ressources

- Supabase Storage : https://supabase.com/docs/guides/storage
- react-dropzone : https://react-dropzone.js.org
- react-pdf : https://github.com/wojtekmaj/react-pdf

---

## Coûts (Supabase Storage)

**Free tier** :
- 1 GB storage
- 2 GB bandwidth/mois

**Pro plan** ($25/mois) :
- 100 GB storage
- 200 GB bandwidth
