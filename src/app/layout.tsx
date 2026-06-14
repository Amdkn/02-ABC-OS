import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider, type Theme } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
// Tour 4 perf (2026-06-14): outlined-only subset instead of the full
// @material-symbols/font-400 index (which loads 3 woff2 fonts eagerly).
// Rounded/Sharp variants are not used in the UI, so skip them.
import "@material-symbols/font-400/outlined.css";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ABC OS — Cooperative Business Operating System",
  description: "African Business Co-ops Sovereign Operating System — Terracotta & Solarpunk design",
};

function resolveInitialTheme(cookieValue: string | undefined): Theme {
  return cookieValue === "dark" ? "dark" : "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const cookieStore = await cookies();
  const initialTheme = resolveInitialTheme(cookieStore.get("theme")?.value);
  const htmlClassName = initialTheme === "dark" ? "dark" : "";

  return (
    <html lang={locale} className={htmlClassName} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
