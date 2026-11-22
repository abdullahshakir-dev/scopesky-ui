"use client";

import NextLink from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { LayoutGrid, List as ListIcon, Search, X } from "@scopesky/ui/icons";
import { categories, categorySlug, components } from "@/lib/registry";
import { cn } from "@scopesky/ui/utils";
import { PreviewCanvas } from "./playground";
import { useSiteTheme } from "./theme";

function Thumb({ slug }: { slug: string }) {
  const site = useSiteTheme();
  return (
    <div className="pointer-events-none relative h-44 overflow-hidden border-b border-line" aria-hidden>
      <div inert className="absolute start-0 top-0 flex h-[142.86%] w-[142.86%] origin-top-left scale-[0.7] rtl:origin-top-right">
        <PreviewCanvas slug={slug} theme={site === "dark" ? "g100" : "white"} rtl={false} compact className="h-full !items-center !justify-center" />
      </div>
    </div>
  );
}

export function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const dq = useDeferredValue(q);

  const filtered = useMemo(() => {
    const s = dq.trim().toLowerCase();
    return components.filter(
      (c) =>
        (cat === "All" || c.category === cat) &&
        (!s || `${c.name} ${c.description} ${c.category} ${c.exports.join(" ")}`.toLowerCase().includes(s)),
    );
  }, [dq, cat]);

  const groups = categories.map((c) => ({ category: c, items: filtered.filter((f) => f.category === c) })).filter((g) => g.items.length);
  const count = (c: string) => components.filter((x) => c === "All" || x.category === c).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-14 z-20 -mx-5 flex flex-col gap-3 border-b border-line bg-bg/95 px-5 py-3 backdrop-blur sm:-mx-10 sm:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex h-9 min-w-0 flex-1 basis-60 items-center rounded-box border border-line-2 bg-bg focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus">
            <Search aria-hidden className="ms-3 size-4 text-ink-2" />
            <span className="sr-only">Filter components</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, part or purpose" className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-placeholder focus:outline-none" />
            {q && (
              <button type="button" aria-label="Clear filter" onClick={() => setQ("")} className="me-1 inline-flex size-7 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div role="radiogroup" aria-label="Layout" className="flex h-9 items-center rounded-box bg-layer p-0.5">
            {[
              { id: "grid" as const, Icon: LayoutGrid, label: "Grid with previews" },
              { id: "list" as const, Icon: ListIcon, label: "Compact list" },
            ].map(({ id, Icon, label }) => (
              <button key={id} type="button" role="radio" aria-checked={view === id} aria-label={label} title={label} onClick={() => setView(id)} className={cn("inline-flex size-8 items-center justify-center rounded-lg transition-colors", view === id ? "bg-bg text-ink shadow-sm" : "text-ink-2 hover:text-ink")}>
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
        <div className="scroll-slim -mb-1 flex gap-1.5 overflow-x-auto pb-1" role="radiogroup" aria-label="Category">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cat === c}
              onClick={() => setCat(c)}
              className={cn("inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", cat === c ? "border-ink bg-ink text-bg" : "border-line-2 text-ink-2 hover:border-line-strong hover:text-ink")}
            >
              {c}
              <span className={cn("tabular-nums", cat === c ? "opacity-70" : "text-ink-3")}>{count(c)}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="-mt-4 text-sm text-ink-2" aria-live="polite">
        {filtered.length === components.length ? `Showing all ${filtered.length} components.` : `${filtered.length} of ${components.length} components match.`}
      </p>

      {filtered.length === 0 && (
        <div className="rounded-box border border-dashed border-line-2 px-6 py-16 text-center">
          <p className="text-base font-semibold text-ink">No components match “{q}”</p>
          <p className="mt-1 text-sm text-ink-2">Try a broader word such as “menu” or “input”, or clear the filters.</p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("All");
            }}
            className="mt-4 text-sm text-link underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.category} id={categorySlug(g.category)} aria-labelledby={`h-${categorySlug(g.category)}`} className="scroll-mt-40">
          <h2 id={`h-${categorySlug(g.category)}`} className="flex items-baseline gap-3 text-[1.75rem] text-ink">
            {g.category}
            <span className="text-sm text-ink-2">{g.items.length}</span>
          </h2>
          {view === "grid" ? (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {g.items.map((c) => (
                <li key={c.slug} className="group relative flex h-full flex-col overflow-hidden rounded-box border border-line bg-bg transition-[border-color,box-shadow] focus-within:border-focus hover:border-line-2 hover:shadow-[0_4px_20px_rgb(15_23_42/0.06)]">
                  <Thumb slug={c.slug} />
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <NextLink href={`/docs/components/${c.slug}`} className="text-base font-semibold text-ink after:absolute after:inset-0 focus-visible:outline-none group-hover:text-link">
                      {c.name}
                    </NextLink>
                    <span className="text-sm leading-6 text-ink-2">{c.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {g.items.map((c) => (
                <li key={c.slug}>
                  <NextLink href={`/docs/components/${c.slug}`} className="group grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-6">
                    <span className="text-sm font-semibold text-ink group-hover:text-link">{c.name}</span>
                    <span className="text-sm text-ink-2">{c.description}</span>
                  </NextLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
