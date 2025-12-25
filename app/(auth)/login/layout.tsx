import { pageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata.login;

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
