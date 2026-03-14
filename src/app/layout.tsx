import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "NoteSaver AI - Ultimate Productivity Suite",
  description: "Save notes, summarize YouTube videos, and search jobs with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <NavbarWrapper />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
