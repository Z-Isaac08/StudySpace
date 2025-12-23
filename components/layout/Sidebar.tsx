"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FolderKanban,
  Home,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Workspaces", href: "/dashboard/workspaces", icon: FolderKanban },
];

const secondaryNavItems: NavItem[] = [
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  onLogout: () => void;
}

// Sidebar content component (shared between desktop and mobile)
function SidebarContent({
  onLogout,
  onLinkClick,
}: {
  onLogout: () => void;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <BookOpen className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold text-sidebar-foreground">
          StudySpace
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Create Workspace Button */}
        <div className="pt-4">
          <Link href="/dashboard/workspaces/new" onClick={onLinkClick}>
            <Button className="w-full gap-2 group/create" size="lg">
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover/create:rotate-90" />
              Nouveau workspace
            </Button>
          </Link>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-sidebar-border px-3 py-4">
        {secondaryNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={() => {
            onLogout();
            onLinkClick?.();
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error-500 transition-colors hover:bg-error-50 dark:hover:bg-error-500/10"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

// Desktop Sidebar (fixed, always visible on large screens)
export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-screen lg:w-64 lg:border-r lg:border-sidebar-border lg:bg-sidebar">
      <SidebarContent onLogout={onLogout} />
    </aside>
  );
}

// Mobile Sidebar (Sheet/Drawer)
export function MobileSidebar({
  open,
  onOpenChange,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar">
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Accédez au dashboard, aux workspaces et aux paramètres
        </SheetDescription>
        <SidebarContent
          onLogout={onLogout}
          onLinkClick={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
