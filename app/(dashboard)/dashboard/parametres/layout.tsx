import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramètres | StudySpace",
  description: "Gérez votre compte et vos préférences de sécurité",
};

export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
