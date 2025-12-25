import { pageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata.register;

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
