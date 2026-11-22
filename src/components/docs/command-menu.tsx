"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, CornerDownLeft, FileText, Palette, Search } from "@scopesky/ui/icons";
import { components } from "@/lib/registry";
import { blueScale, neutralScale } from "@/lib/tokens";
import { cn, copyText } from "@scopesky/ui/utils";
import { useFocusTrap } from "@scopesky/ui/hooks";
import { nav } from "./nav-data";

type Entry = { group: "Pages" | "Components" | "Colors"; title: string; hint: string; href?: string; copy?: string };

const entries: Entry[] = [
  ...nav.flatMap((s) =>
    s.items
      ? s.items.filter((i) => !i.href.startsWith("/docs/components/")).map((i) => ({ group: "Pages" as const, title: i.title, hint: s.title, href: i.href }))
      : [{ group: "Pages" as const, title: s.title, hint: "Docs", href: s.href }],
  ),
  ...components.map((c) => ({ group: "Components" as const, title: c.name, hint: `${c.category} · ${c.description}`, href: `/docs/components/${c.slug}` })),
  ...blueScale.map((s) => ({ group: "Colors" as const, title: `Blue ${s.step}`, hint: `${s.hex} · ${s.usage}`, copy: s.hex })),
  ...neutralScale.map((s) => ({ group: "Colors" as const, title: `Gray ${s.step}`, hint: `${s.hex} · ${s.usage}`, copy: s.hex })),
];

const icon = { Pages: FileText, Components: Box, Colors: Palette };

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const trap = useFocusTrap<HTMLDivElement>(open, "input");

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = s ? entries.filter((e) => `${e.title} ${e.hint}`.toLowerCase().includes(s)).sort((a, b) => Number(!a.title.toLowerCase().startsWith(s)) - Number(!b.title.toLowerCase().startsWith(s))) : entries.filter((e) => e.group !== "Colors").slice(0, 14);
    return r.slice(0, 40);
  }, [q]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const run = async (e: Entry) => {
    if (e.href) {
      router.push(e.href);
      onOpenChange(false);
      setQ("");
    } else if (e.copy) {
      await copyText(e.copy);
      setToast(`Copied ${e.copy}`);
      setTimeout(() => setToast(""), 1400);
    }
  };

  const groups = (["Pages", "Components", "Colors"] as const).map((g) => ({ g, items: results.filter((r) => r.group === g) })).filter((x) => x.items.length);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-overlay p-4 pt-[12vh] animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}>
      <div
        ref={trap}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-layer-2 shadow-[0_24px_64px_rgb(0_0_0/0.3)] animate-pop"
        onKeyDown={(e) => {
          if (e.key === "Escape") onOpenChange(false);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(results.length - 1, a + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          }
          if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            run(results[active]);
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden className="size-4 text-ink-2" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Search components, patterns and tokens"
            role="combobox"
            aria-expanded
            aria-controls="cmdk-list"
            aria-activedescendant={`cmdk-${active}`}
            className="h-12 flex-1 bg-transparent text-sm text-ink placeholder:text-placeholder focus:outline-none"
          />
          <kbd className="rounded-sm border border-line-2 px-1.5 text-[11px] text-ink-2">Esc</kbd>
        </div>
        <div ref={list} id="cmdk-list" role="listbox" className="scroll-slim max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-ink-2">Nothing matches “{q}”. Try a component name like “tabs” or a hex like “#006B9B”.</p>}
          {groups.map(({ g, items }) => {
            const Icon = icon[g];
            return (
              <div key={g} role="group" aria-label={g}>
                <p className="px-3 pb-1 pt-3 text-xs font-medium text-ink-2">{g}</p>
                {items.map((e) => {
                  const i = results.indexOf(e);
                  return (
                    <div
                      key={`${g}-${e.title}`}
                      id={`cmdk-${i}`}
                      data-i={i}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(e)}
                      className={cn("flex cursor-pointer items-center gap-3 rounded-md px-3 py-2", i === active && "bg-layer-hover")}
                    >
                      {g === "Colors" ? <span className="size-4 shrink-0 rounded-sm border border-black/10" style={{ background: e.copy }} /> : <Icon aria-hidden className="size-4 shrink-0 text-ink-2" />}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-ink">{e.title}</span>
                        <span className="block truncate text-xs text-ink-2">{e.hint}</span>
                      </span>
                      {i === active && <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-ink-2" />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-ink-2" aria-live="polite">
          <span>{toast || "Enter opens a page. On a color, Enter copies its hex."}</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
