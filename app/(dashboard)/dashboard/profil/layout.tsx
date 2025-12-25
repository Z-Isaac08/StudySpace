import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil | StudySpace",
  description: "Gérez vos informations personnelles et consultez vos statistiques",
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
