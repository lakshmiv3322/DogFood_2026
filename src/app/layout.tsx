import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DOGFOOD 2026 — Hackathon Portal",
  description: "The DOGFOOD 2026 hackathon judging portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-[#0a0f1e] text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
