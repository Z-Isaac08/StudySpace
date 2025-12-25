import { pageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata.workspaces;

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
