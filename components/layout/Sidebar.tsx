"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  FolderKanban,
  Home,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
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
            <Link href="/dashboard/workspaces/new">
              <Button className="w-full gap-2 group/create" size="sm">
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
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error-500 transition-colors hover:bg-error-50 dark:hover:bg-error-500/10"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
