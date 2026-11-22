"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "@scopesky/ui/icons";
import { CommandMenu } from "./command-menu";
import { SidebarNav } from "./sidebar";
import { ThemeToggle } from "./theme";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#004969" />
      <path d="M7 21.5 13 15.5l4.5 4.5L25 11" fill="none" stroke="#0094DA" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25" cy="11" r="2.25" fill="#9DD8F3" />
    </svg>
  );
}

export function Logo() {
  return (
    <NextLink href="/" className="flex min-w-0 items-center gap-3 rounded-md" aria-label="ScopeSky UI home">
      <LogoMark />
      <span className="truncate text-xs font-bold uppercase tracking-[0.06em] text-ink">
        ScopeSky <span className="hidden sm:inline">Communications</span> UI <span className="hidden xl:inline">Dashboard</span>
      </span>
    </NextLink>
  );
}

export function SiteHeader() {
  const [cmd, setCmd] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmd((c) => !c);
      }
      if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea,select,[contenteditable]")) {
        e.preventDefault();
        setCmd(true);
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <>
      {/* The canvas strip above the header keeps the gutter visible while content scrolls underneath. */}
      <div className="sticky top-0 z-50 -mx-2 -mt-2 bg-canvas px-2 pt-2">
        <header className="relative flex h-12 items-center gap-3 rounded-[10px] border border-line bg-bg px-2 sm:px-2.5">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover hover:text-ink lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Logo />

          <button
            type="button"
            onClick={() => setCmd(true)}
            aria-label="Search components, patterns and tokens"
            className="ms-auto flex h-9 w-9 items-center gap-2.5 rounded-full border border-line bg-layer px-2.5 text-sm text-ink-2 transition-colors hover:border-line-2 hover:text-ink sm:w-72 md:absolute md:start-1/2 md:ms-0 md:w-[min(30rem,40vw)] md:-translate-x-1/2 md:px-3.5 rtl:md:translate-x-1/2"
          >
            <Search className="size-4" strokeWidth={1.75} />
            <span className="hidden flex-1 truncate text-start sm:inline">Search components, patterns and tokens</span>
            <kbd className="hidden h-5 items-center rounded-md border border-line-2 bg-bg px-1.5 font-sans text-[11px] font-medium text-ink sm:inline-flex">Ctrl K</kbd>
          </button>

          <div className="flex items-center gap-1 md:ms-auto">
            <ThemeToggle />
          </div>
        </header>
      </div>

      {mobile && (
        <div className="fixed inset-0 z-[65] bg-overlay p-2 animate-fade lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && setMobile(false)}>
          <div className="flex h-full w-[min(20rem,85vw)] flex-col overflow-hidden rounded-[10px] border border-line bg-bg shadow-xl animate-pop">
            <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line px-2.5">
              <Logo />
              <button type="button" aria-label="Close menu" onClick={() => setMobile(false)} className="inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover hover:text-ink">
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <SidebarNav onNavigate={() => setMobile(false)} />
            </div>
          </div>
        </div>
      )}

      <CommandMenu open={cmd} onOpenChange={setCmd} />
    </>
  );
}
