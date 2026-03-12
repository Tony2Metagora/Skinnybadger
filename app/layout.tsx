import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkinnyBadger - Fitness Tracker",
  description: "Track your workout progress and health metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
