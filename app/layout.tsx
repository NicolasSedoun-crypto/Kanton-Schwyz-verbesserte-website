import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onlineschalter · Kanton Schwyz",
  description: "Privater UX-Prototyp mit persönlichem Profil und gespeicherten Anliegen.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH">
      <body className="antialiased">{children}</body>
    </html>
  );
}
