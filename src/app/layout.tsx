import type { Metadata } from "next";
import { Geist, Geist_Mono, Readex_Pro } from "next/font/google";
import { SiteHeader } from "@/components/docs/site-header";
import { Sidebar } from "@/components/docs/sidebar";
import { themeScript } from "@/components/docs/theme";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Geist has no Arabic glyphs; Readex Pro fills them in through the font stack.
const readex = Readex_Pro({
  variable: "--font-readex",
  subsets: ["arabic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ScopeSky UI", template: "%s · ScopeSky UI" },
  description: "Components, tokens and patterns for every ScopeSky website, hand-built with React and Tailwind CSS and themed in ScopeSky blue.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${geist.variable} ${readex.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-canvas antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white">
          Skip to content
        </a>
        <div className="flex min-h-dvh flex-col gap-2 p-2">
          <SiteHeader />
          <div className="flex flex-1 items-start gap-2">
            <Sidebar />
            <main id="main" className="min-h-[calc(100dvh-4.5rem)] min-w-0 flex-1 self-stretch rounded-[10px] border border-line bg-bg">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
