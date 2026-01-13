import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getGlobalData } from "@/lib/mdx";

export async function generateMetadata() {
  const globalData = getGlobalData();
  const name = globalData?.name || "Giuseppe Tamayo C.";
  return {
    title: `${name} | Portfolio`,
    description: `Full Stack Developer Portfolio`,
    other: {
      "format-detection": "telephone=no, date=no, email=no, address=no",
    },
  };
}

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LazyMotion, domAnimation } from "framer-motion";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = getGlobalData();

  return (
    <html lang="es" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
        data-bitwarden-no-filtering="true"
      >
        <LazyMotion features={domAnimation}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col pt-8" suppressHydrationWarning>
              <Header data={globalData} />
              <main className="flex-grow" suppressHydrationWarning>
                {children}
              </main>
              <Footer data={globalData} />
            </div>
          </ThemeProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
