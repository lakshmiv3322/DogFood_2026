import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const fontSans = localFont({
  src: [
    {
      path: "../assets/fonts/InterTight-Variable.woff2",
      style: "normal",
    },
    {
      path: "../assets/fonts/InterTight-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/InterTight-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const fontMono = localFont({
  src: [
    {
      path: "../assets/fonts/JetBrainsMono-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DOGFOOD 2026 — Hackathon Portal",
  description: "The DOGFOOD 2026 hackathon judging portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const themePref = cookieStore.get("theme")?.value ?? "dark";
  const initialTheme = themePref === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      data-theme-pref={themePref}
      className={`${initialTheme} ${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-bg-1 text-text-primary antialiased font-sans selection:bg-accent/25 transition-colors">
        {children}
      </body>
    </html>
  );
}
