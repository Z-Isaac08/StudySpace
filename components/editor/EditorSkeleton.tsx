"use client";

/**
 * EditorSkeleton Component
 * Loading skeleton for the collaborative editor
 */

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorSkeletonProps {
  className?: string;
}

export function EditorSkeleton({ className }: EditorSkeletonProps) {
  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-white dark:bg-neutral-950",
        className
      )}
    >
      {/* Toolbar skeleton */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>

      {/* Editor content skeleton */}
      <div className="p-4 min-h-[400px] space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="py-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <div className="py-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
