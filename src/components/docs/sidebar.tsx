"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, History, House, LayoutGrid, LayoutTemplate, Lightbulb, Palette } from "@scopesky/ui/icons";
import { cn } from "@scopesky/ui/utils";
import { nav, type NavSection } from "./nav-data";

const icons = {
  house: House,
  lightbulb: Lightbulb,
  palette: Palette,
  grid: LayoutGrid,
  template: LayoutTemplate,
  history: History,
};

const row = "flex h-8 w-full items-center gap-3 rounded-lg px-2.5 text-sm transition-colors";

function Section({ s, path, onNavigate }: { s: NavSection; path: string; onNavigate?: () => void }) {
  const Icon = icons[s.icon];
  const containsActive = !!s.items?.some((i) => i.href === path || (i.href !== "/docs/components" && path.startsWith(i.href + "/")));
  const [open, setOpen] = useState(containsActive || s.title === "Components");
  const prev = useRef(containsActive);
  useEffect(() => {
    if (containsActive && !prev.current) setOpen(true);
    prev.current = containsActive;
  }, [containsActive]);

  if (!s.items) {
    const active = s.href === path;
    return (
      <NextLink
        href={s.href!}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(row, "font-semibold", active ? "bg-layer-selected text-ink" : "text-ink-2 hover:bg-layer-hover hover:text-ink")}
      >
        <Icon className="size-4" strokeWidth={1.75} />
        {s.title}
      </NextLink>
    );
  }
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(row, "text-start font-semibold hover:bg-layer-hover hover:text-ink", containsActive ? "text-ink" : "text-ink-2")}
      >
        <Icon className="size-4" strokeWidth={1.75} />
        <span className="flex-1">{s.title}</span>
        <ChevronDown className={cn("size-3.5 text-ink-3 transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mb-1.5 mt-0.5 flex flex-col gap-px">
          {s.items.map((i) => {
            const active = i.href === path;
            return (
              <li key={i.href}>
                <NextLink
                  href={i.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center rounded-lg ps-[2.375rem] pe-2.5 text-sm transition-colors",
                    active ? "bg-layer-selected font-medium text-ink" : "text-ink-2 hover:bg-layer-hover hover:text-ink",
                  )}
                >
                  <span className="truncate">{i.title}</span>
                </NextLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && ref.current) {
      const r = el.getBoundingClientRect();
      const c = ref.current.getBoundingClientRect();
      if (r.top < c.top || r.bottom > c.bottom) el.scrollIntoView({ block: "center" });
    }
  }, [path]);
  const top = nav.filter((s) => !s.items && s.title !== "Changelog");
  const rest = nav.filter((s) => s.items || s.title === "Changelog");
  return (
    <nav ref={ref} aria-label="Documentation" className="scroll-slim flex h-full flex-col gap-0.5 overflow-y-auto p-2 pb-8 [&>*]:shrink-0">
      {top.map((s) => (
        <Section key={s.title} s={s} path={path} onNavigate={onNavigate} />
      ))}
      <hr className="mx-2.5 my-2 border-line" />
      {rest.map((s) => (
        <Section key={s.title} s={s} path={path} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4.5rem)] w-60 shrink-0 overflow-hidden rounded-[10px] border border-line bg-bg lg:block">
      <SidebarNav />
    </aside>
  );
}
