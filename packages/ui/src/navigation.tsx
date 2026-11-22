"use client";

import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  Grid3x3,
  Menu as MenuIcon,
  MoreHorizontal,
  MoreVertical,
  Search,
  UserCircle,
} from "./icons.js";
import { cn } from "./utils.js";
import { useDismiss } from "./hooks.js";
import { Kbd } from "./data.js";

/* ---------- tabs ---------- */

export function Tabs({
  tabs,
  variant = "line",
  label,
}: {
  tabs: { label: string; content: ReactNode; disabled?: boolean }[];
  variant?: "line" | "contained";
  label: string;
}) {
  const [i, setI] = useState(0);
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const move = (d: number) => {
    let n = i;
    do n = (n + d + tabs.length) % tabs.length;
    while (tabs[n].disabled && n !== i);
    setI(n);
    refs.current[n]?.focus();
  };
  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={label}
        className={cn("flex overflow-x-auto [scrollbar-width:none]", variant === "line" ? "border-b border-line" : "w-fit max-w-full gap-1 rounded-box bg-layer p-1")}
        onKeyDown={(e) => {
          const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
          if (e.key === "ArrowRight") move(rtl ? -1 : 1);
          if (e.key === "ArrowLeft") move(rtl ? 1 : -1);
          if (e.key === "Home") move(-i);
        }}
      >
        {tabs.map((t, n) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[n] = el;
            }}
            role="tab"
            id={`${id}-t${n}`}
            aria-selected={i === n}
            aria-controls={`${id}-p${n}`}
            tabIndex={i === n ? 0 : -1}
            disabled={t.disabled}
            onClick={() => setI(n)}
            className={cn(
              "relative shrink-0 whitespace-nowrap px-4 text-sm transition-colors focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-placeholder",
              variant === "line"
                ? cn("h-10 -mb-px border-b-2", i === n ? "border-focus font-semibold text-ink" : "border-transparent text-ink-2 hover:border-line-strong hover:text-ink")
                : cn("h-9 min-w-28 rounded-lg text-center", i === n ? "bg-bg font-semibold text-ink shadow-[0_1px_3px_rgb(15_23_42/0.12)] ring-1 ring-line" : "text-ink-2 hover:bg-layer-hover hover:text-ink"),
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, n) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-p${n}`}
          aria-labelledby={`${id}-t${n}`}
          hidden={i !== n}
          tabIndex={0}
          className={cn("py-4 text-sm text-ink", variant === "contained" && "px-1")}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}

/* ---------- breadcrumb ---------- */

export function Breadcrumb({ items, noTrailingSlash = true }: { items: string[]; noTrailingSlash?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it} className="inline-flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {it}
                </span>
              ) : (
                <a href="#" onClick={(e) => e.preventDefault()} className="text-link hover:underline">
                  {it}
                </a>
              )}
              {(!last || !noTrailingSlash) && <span aria-hidden className="text-ink-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- pagination ---------- */

export function Pagination({ total = 237, pageSizes = [10, 20, 50] }: { total?: number; pageSizes?: number[] }) {
  const [size, setSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / size));
  const from = (page - 1) * size + 1;
  const to = Math.min(total, page * size);
  const sel = "h-full bg-transparent px-3 text-sm text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px]";
  return (
    <div className="flex h-10 w-full items-stretch overflow-hidden rounded-box border border-line bg-layer text-sm text-ink">
      <label className="flex items-center gap-1 border-e border-line ps-4">
        <span className="hidden text-ink-2 sm:inline">Items per page:</span>
        <select
          value={size}
          onChange={(e) => {
            setSize(+e.target.value);
            setPage(1);
          }}
          className={sel}
        >
          {pageSizes.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <span className="flex flex-1 items-center px-4 text-ink-2" aria-live="polite">
        {from}–{to} of {total} items
      </span>
      <label className="flex items-center border-s border-line">
        <span className="sr-only">Page number</span>
        <select value={page} onChange={(e) => setPage(+e.target.value)} className={sel}>
          {Array.from({ length: pages }, (_, i) => (
            <option key={i}>{i + 1}</option>
          ))}
        </select>
        <span className="hidden pe-4 text-ink-2 sm:inline">of {pages} pages</span>
      </label>
      {[
        { d: -1, label: "Previous page", icon: <ChevronLeft className="size-4 rtl:rotate-180" /> },
        { d: 1, label: "Next page", icon: <ChevronRight className="size-4 rtl:rotate-180" /> },
      ].map((b) => (
        <button
          key={b.label}
          type="button"
          aria-label={b.label}
          disabled={(b.d < 0 && page === 1) || (b.d > 0 && page === pages)}
          onClick={() => setPage((p) => p + b.d)}
          className="flex w-10 items-center justify-center border-s border-line hover:bg-layer-hover disabled:cursor-not-allowed disabled:text-placeholder focus-visible:outline-offset-[-2px]"
        >
          {b.icon}
        </button>
      ))}
    </div>
  );
}

export function PaginationNav({ pages = 12 }: { pages?: number }) {
  const [p, setP] = useState(4);
  const list = useMemo(() => {
    const s = new Set([1, pages, p - 1, p, p + 1].filter((n) => n >= 1 && n <= pages));
    return [...s].sort((a, b) => a - b);
  }, [p, pages]);
  return (
    <nav aria-label="Pagination">
      <ul className="flex items-center">
        <li>
          <button type="button" aria-label="Previous page" disabled={p === 1} onClick={() => setP(p - 1)} className="inline-flex size-10 items-center justify-center rounded-box hover:bg-layer-hover disabled:text-placeholder">
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
        </li>
        {list.map((n, i) => (
          <li key={n} className="contents">
            {i > 0 && n - list[i - 1] > 1 && (
              <span aria-hidden className="inline-flex size-10 items-center justify-center text-ink-2">
                …
              </span>
            )}
            <button
              type="button"
              aria-current={n === p ? "page" : undefined}
              aria-label={`Page ${n}`}
              onClick={() => setP(n)}
              className={cn(
                "relative inline-flex size-10 items-center justify-center rounded-box text-sm",
                n === p ? "bg-primary font-semibold text-on-color" : "text-ink-2 hover:bg-layer-hover hover:text-ink",
              )}
            >
              {n}
            </button>
          </li>
        ))}
        <li>
          <button type="button" aria-label="Next page" disabled={p === pages} onClick={() => setP(p + 1)} className="inline-flex size-10 items-center justify-center rounded-box hover:bg-layer-hover disabled:text-placeholder">
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

/* ---------- menus ---------- */

export type MenuItem = { label: string; danger?: boolean; shortcut?: string; divider?: boolean; disabled?: boolean };

export function MenuList({ items, onPick, label }: { items: MenuItem[]; onPick: (l: string) => void; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  return (
    <ul
      ref={ref}
      role="menu"
      aria-label={label}
      onKeyDown={(e) => {
        const els = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not([aria-disabled=true])") ?? []);
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          els[(i + 1) % els.length]?.focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          els[(i - 1 + els.length) % els.length]?.focus();
        }
      }}
      className="min-w-48 rounded-box border border-line bg-layer-2 p-1 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop"
    >
      {items.map((it) =>
        it.divider ? (
          <li key={it.label} role="separator" className="my-1 h-px bg-line" />
        ) : (
          <li
            key={it.label}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={it.disabled || undefined}
            onClick={() => !it.disabled && onPick(it.label)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !it.disabled && (e.preventDefault(), onPick(it.label))}
            className={cn(
              "flex h-9 cursor-pointer items-center justify-between gap-6 rounded-lg px-3 text-sm focus-visible:outline-offset-[-2px]",
              it.disabled ? "cursor-not-allowed text-placeholder" : it.danger ? "text-danger hover:bg-danger-strong hover:text-white focus:bg-danger-strong focus:text-white" : "text-ink-2 hover:bg-layer-hover hover:text-ink focus:bg-layer-hover",
            )}
          >
            {it.label}
            {it.shortcut && <span className="text-xs text-ink-3">{it.shortcut}</span>}
          </li>
        ),
      )}
    </ul>
  );
}

function useMenu() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const openAndFocus = () => {
    setOpen(true);
    setTimeout(() => ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(), 0);
  };
  return { open, setOpen, ref, openAndFocus };
}

export function OverflowMenu({ items, label = "Options", onPick, align = "end", vertical = true }: { items: MenuItem[]; label?: string; onPick?: (l: string) => void; align?: "start" | "end"; vertical?: boolean }) {
  const { open, setOpen, ref, openAndFocus } = useMenu();
  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openAndFocus())}
        className={cn("inline-flex size-10 items-center justify-center rounded-box text-ink hover:bg-layer-hover", open && "bg-layer-hover")}
      >
        {vertical ? <MoreVertical className="size-4" /> : <MoreHorizontal className="size-4" />}
      </button>
      {open && (
        <div className={cn("absolute top-full z-40 mt-1", align === "end" ? "end-0" : "start-0")}>
          <MenuList
            items={items}
            label={label}
            onPick={(l) => {
              setOpen(false);
              onPick?.(l);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function MenuButton({ label, items, kind = "primary", onPick }: { label: string; items: MenuItem[]; kind?: "primary" | "tertiary" | "ghost"; onPick?: (l: string) => void }) {
  const { open, setOpen, ref, openAndFocus } = useMenu();
  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openAndFocus())}
        className={cn(
          "inline-flex h-10 items-center gap-6 rounded-box px-4 text-sm font-medium transition-colors",
          kind === "primary" && "bg-primary text-on-color hover:bg-primary-hover",
          kind === "tertiary" && "border border-primary bg-bg text-link hover:bg-tint",
          kind === "ghost" && "text-link hover:bg-tint",
        )}
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute start-0 top-full z-40 mt-1 w-full min-w-48">
          <MenuList
            items={items}
            label={label}
            onPick={(l) => {
              setOpen(false);
              onPick?.(l);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function ContextMenuArea({ items, children }: { items: MenuItem[]; children: ReactNode }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [picked, setPicked] = useState("");
  const ref = useDismiss<HTMLDivElement>(!!pos, () => setPos(null));
  return (
    <div
      ref={ref}
      className="relative flex h-44 w-full max-w-md select-none flex-col items-center justify-center gap-1 rounded-box border border-dashed border-line-strong text-sm text-ink-2"
      onContextMenu={(e) => {
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        setTimeout(() => ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(), 0);
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
          e.preventDefault();
          setPos({ x: 24, y: 24 });
          setTimeout(() => ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(), 0);
        }
      }}
    >
      {children}
      {picked && <span className="text-xs text-ink">Last action: {picked}</span>}
      {pos && (
        <div className="absolute z-40" style={{ left: pos.x, top: pos.y }}>
          <MenuList
            items={items}
            label="Context menu"
            onPick={(l) => {
              setPicked(l);
              setPos(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function Menubar({ menus }: { menus: { label: string; items: MenuItem[] }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useDismiss<HTMLDivElement>(open !== null, () => setOpen(null));
  return (
    <div ref={ref} role="menubar" className="inline-flex h-10 items-center gap-0.5 rounded-box border border-line-2 bg-bg p-1">
      {menus.map((m, i) => (
        <div key={m.label} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => open !== null && setOpen(i)}
            className={cn("h-8 rounded-lg px-3 text-sm font-medium text-ink hover:bg-layer-hover", open === i && "bg-layer-hover")}
          >
            {m.label}
          </button>
          {open === i && (
            <div className="absolute start-0 top-full z-40 mt-1.5">
              <MenuList items={m.items} label={m.label} onPick={() => setOpen(null)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function NavigationMenu({ items }: { items: { label: string; links?: { title: string; body: string }[] }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useDismiss<HTMLElement>(open !== null, () => setOpen(null));
  return (
    <nav ref={ref} aria-label="Main" className="relative" onMouseLeave={() => setOpen(null)}>
      <ul className="flex items-center gap-1">
        {items.map((it, i) => (
          <li key={it.label}>
            {it.links ? (
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                onMouseEnter={() => setOpen(i)}
                className={cn("inline-flex h-9 items-center gap-1 rounded-lg px-4 text-sm font-medium text-ink hover:bg-layer-hover", open === i && "bg-layer-hover")}
              >
                {it.label}
                <ChevronDown className={cn("size-3 transition-transform", open === i && "rotate-180")} />
              </button>
            ) : (
              <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-ink hover:bg-layer-hover">
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ul>
      {open !== null && items[open].links && (
        <div className="absolute start-0 top-full z-40 mt-1.5 w-[min(32rem,90vw)] rounded-box border border-line bg-layer-2 p-2 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop">
          <ul className="grid gap-1 sm:grid-cols-2">
            {items[open].links!.map((l) => (
              <li key={l.title}>
                <a href="#" onClick={(e) => e.preventDefault()} className="block rounded-lg p-3 hover:bg-layer-hover">
                  <span className="block text-sm font-medium text-ink">{l.title}</span>
                  <span className="mt-1 block text-sm text-ink-2">{l.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ---------- command ---------- */

export function Command({ groups, placeholder = "Type a command or search…" }: { groups: { heading: string; items: { label: string; icon?: ReactNode; shortcut?: string }[] }[]; placeholder?: string }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [ran, setRan] = useState("");
  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length);
  const flat = filtered.flatMap((g) => g.items);
  return (
    <div className="w-full max-w-md overflow-hidden rounded-box border border-line bg-layer-2 shadow-[0_8px_24px_rgb(15_23_42/0.12)]">
      <div className="flex items-center gap-2 border-b border-line px-3">
        <Search aria-hidden className="size-4 text-ink-2" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(flat.length - 1, a + 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            }
            if (e.key === "Enter" && flat[active]) setRan(flat[active].label);
          }}
          placeholder={placeholder}
          aria-label="Command search"
          role="combobox"
          aria-expanded
          aria-controls="cmd-list"
          className="h-11 flex-1 bg-transparent text-sm text-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>
      <div id="cmd-list" role="listbox" className="max-h-64 overflow-auto p-1">
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-ink-2">No results. Try a different word.</p>}
        {filtered.map((g) => (
          <div key={g.heading} role="group" aria-label={g.heading}>
            <p className="px-2 pb-1 pt-2 text-xs font-medium text-ink-2">{g.heading}</p>
            {g.items.map((it) => {
              const idx = flat.indexOf(it);
              return (
                <div
                  key={it.label}
                  role="option"
                  aria-selected={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => setRan(it.label)}
                  className={cn("flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm text-ink [&>svg]:size-4 [&>svg]:text-ink-2", idx === active && "bg-layer-hover")}
                >
                  {it.icon}
                  <span className="flex-1">{it.label}</span>
                  {it.shortcut && <Kbd>{it.shortcut}</Kbd>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-ink-2" aria-live="polite">
        <span>{ran ? `Ran “${ran}”` : "Use arrow keys to move"}</span>
        <span className="inline-flex items-center gap-1">
          <CornerDownLeft className="size-3" /> to run
        </span>
      </div>
    </div>
  );
}

/* ---------- UI shell ---------- */

export function UIShell({ product = "ScopeSky", portal = "Customer portal" }: { product?: string; portal?: string }) {
  const [nav, setNav] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const links = ["Dashboard", "Services", "Requests", "Invoices", "Support"];
  return (
    <div className="w-full overflow-hidden rounded-box border border-line">
      <header className="flex h-12 items-center bg-[#161b22] text-[#f1f5f9]">
        <button type="button" aria-label={nav ? "Close menu" : "Open menu"} aria-expanded={nav} onClick={() => setNav(!nav)} className="inline-flex size-12 items-center justify-center hover:bg-white/10">
          <MenuIcon className="size-5" />
        </button>
        <a href="#" onClick={(e) => e.preventDefault()} className="flex h-full items-center gap-1 px-4 text-sm">
          <span className="font-semibold">{product}</span>
          <span className="text-[#cbd5e1]">{portal}</span>
        </a>
        <nav aria-label={portal} className="hidden h-full md:flex">
          {["Plans", "Coverage", "Help"].map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()} className="flex h-full items-center px-4 text-sm text-[#cbd5e1] hover:bg-white/10 hover:text-white">
              {l}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex">
          {[
            { l: "Search", i: <Search className="size-5" /> },
            { l: "Notifications", i: <Bell className="size-5" /> },
            { l: "Profile", i: <UserCircle className="size-5" /> },
            { l: "App switcher", i: <Grid3x3 className="size-5" /> },
          ].map((b) => (
            <button key={b.l} type="button" aria-label={b.l} title={b.l} className="inline-flex size-12 items-center justify-center hover:bg-white/10">
              {b.i}
            </button>
          ))}
        </div>
      </header>
      <div className="flex h-56 bg-bg">
        {nav && (
          <nav aria-label="Side navigation" className="w-52 shrink-0 border-e border-line bg-layer py-2">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                aria-current={active === l ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(l);
                }}
                className={cn(
                  "relative flex h-8 items-center px-4 text-sm",
                  active === l ? "bg-layer-selected font-semibold text-ink before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-accent" : "text-ink-2 hover:bg-layer-hover hover:text-ink",
                )}
              >
                {l}
              </a>
            ))}
          </nav>
        )}
        <main className="flex-1 p-6">
          <p className="text-xs text-ink-2">Home / {active}</p>
          <h3 className="mt-1 text-2xl text-ink">{active}</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((n) => (
              <div key={n} className="h-16 bg-layer" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
