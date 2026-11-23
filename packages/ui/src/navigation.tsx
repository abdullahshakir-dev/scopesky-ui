"use client";

import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, Menu as MenuIcon, MoreHorizontal, MoreVertical, Search } from "./icons.js";
import { cn } from "./utils.js";
import { useControllableState, useDismiss } from "./hooks.js";
import { useMessages } from "./locale.js";
import { Kbd } from "./data.js";

/* ---------- tabs ---------- */

export interface TabItem {
  /** Defaults to the tab's index. */
  id?: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: readonly TabItem[];
  variant?: "line" | "contained";
  label: string;
  /** Id of the open tab. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, variant = "line", label, value, defaultValue, onValueChange, className }: TabsProps) {
  const keyOf = (t: TabItem, n: number) => t.id ?? String(n);
  const firstEnabled = tabs.findIndex((t) => !t.disabled);
  const [v, setV] = useControllableState(value, defaultValue ?? (firstEnabled >= 0 ? keyOf(tabs[firstEnabled], firstEnabled) : "0"), onValueChange);
  const i = Math.max(0, tabs.findIndex((t, n) => keyOf(t, n) === v));
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const go = (n: number) => {
    setV(keyOf(tabs[n], n));
    refs.current[n]?.focus();
  };
  const move = (from: number, d: number) => {
    let n = from;
    do n = (n + d + tabs.length) % tabs.length;
    while (tabs[n].disabled && n !== from);
    go(n);
  };
  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label={label}
        className={cn("flex overflow-x-auto [scrollbar-width:none]", variant === "line" ? "border-b border-line" : "w-fit max-w-full gap-1 rounded-box bg-layer p-1")}
        onKeyDown={(e) => {
          const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
          if (e.key === "ArrowRight") move(i, rtl ? -1 : 1);
          if (e.key === "ArrowLeft") move(i, rtl ? 1 : -1);
          if (e.key === "Home") move(tabs.length - 1, 1);
          if (e.key === "End") move(0, -1);
        }}
      >
        {tabs.map((t, n) => (
          <button
            key={keyOf(t, n)}
            ref={(el) => {
              refs.current[n] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-t${n}`}
            aria-selected={i === n}
            aria-controls={`${id}-p${n}`}
            tabIndex={i === n ? 0 : -1}
            disabled={t.disabled}
            onClick={() => setV(keyOf(t, n))}
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
          key={keyOf(t, n)}
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

export type BreadcrumbItem = string | { label: ReactNode; href?: string; onClick?: () => void };

export function Breadcrumb({ items, noTrailingSlash = true, label, className }: { items: readonly BreadcrumbItem[]; noTrailingSlash?: boolean; label?: string; className?: string }) {
  const m = useMessages();
  return (
    <nav aria-label={label ?? m.breadcrumb} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 text-sm">
        {items.map((raw, i) => {
          const it = typeof raw === "string" ? { label: raw } : raw;
          const last = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {it.label}
                </span>
              ) : "href" in it && it.href ? (
                <a href={it.href} onClick={"onClick" in it ? it.onClick : undefined} className="text-link hover:underline">
                  {it.label}
                </a>
              ) : "onClick" in it && it.onClick ? (
                <button type="button" onClick={it.onClick} className="text-link hover:underline">
                  {it.label}
                </button>
              ) : (
                <span className="text-ink-2">{it.label}</span>
              )}
              {(!last || !noTrailingSlash) && (
                <span aria-hidden className="text-ink-2">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- pagination ---------- */

export interface PaginationProps {
  /** Total number of items. */
  total: number;
  /** 1-based. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizes?: readonly number[];
  className?: string;
}

const PAGE_SIZES = [10, 20, 50];

export function Pagination({ total, page, defaultPage = 1, onPageChange, pageSize, defaultPageSize, onPageSizeChange, pageSizes = PAGE_SIZES, className }: PaginationProps) {
  const m = useMessages();
  const [size, setSize] = useControllableState(pageSize, defaultPageSize ?? pageSizes[0] ?? 10, onPageSizeChange);
  const [p, setP] = useControllableState(page, defaultPage, onPageChange);
  const pages = Math.max(1, Math.ceil(total / size));
  const cur = Math.min(Math.max(1, p), pages);
  const from = total === 0 ? 0 : (cur - 1) * size + 1;
  const to = Math.min(total, cur * size);
  const sel = "h-full bg-transparent px-3 text-sm text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px]";
  return (
    <div className={cn("flex h-10 w-full items-stretch overflow-hidden rounded-box border border-line bg-layer text-sm text-ink", className)}>
      <label className="flex items-center gap-1 border-e border-line ps-4">
        <span className="hidden text-ink-2 sm:inline">{m.itemsPerPage}</span>
        <select
          value={size}
          onChange={(e) => {
            setSize(+e.target.value);
            setP(1);
          }}
          className={sel}
        >
          {pageSizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <span className="flex flex-1 items-center px-4 text-ink-2" aria-live="polite">
        {m.itemRange(from, to, total)}
      </span>
      <label className="flex items-center border-s border-line">
        <span className="sr-only">{m.pageNumber}</span>
        <select value={cur} onChange={(e) => setP(+e.target.value)} className={sel}>
          {Array.from({ length: pages }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <span className="hidden pe-4 text-ink-2 sm:inline">{m.ofPages(pages)}</span>
      </label>
      {[
        { d: -1, label: m.previousPage, icon: <ChevronLeft className="size-4 rtl:rotate-180" /> },
        { d: 1, label: m.nextPage, icon: <ChevronRight className="size-4 rtl:rotate-180" /> },
      ].map((b) => (
        <button
          key={b.d}
          type="button"
          aria-label={b.label}
          disabled={(b.d < 0 && cur === 1) || (b.d > 0 && cur === pages)}
          onClick={() => setP(cur + b.d)}
          className="flex w-10 items-center justify-center border-s border-line hover:bg-layer-hover disabled:cursor-not-allowed disabled:text-placeholder focus-visible:outline-offset-[-2px]"
        >
          {b.icon}
        </button>
      ))}
    </div>
  );
}

export function PaginationNav({ pages, page, defaultPage = 1, onPageChange, label, className }: { pages: number; page?: number; defaultPage?: number; onPageChange?: (page: number) => void; label?: string; className?: string }) {
  const m = useMessages();
  const [raw, setP] = useControllableState(page, defaultPage, onPageChange);
  const p = Math.min(Math.max(1, raw), Math.max(1, pages));
  const list = useMemo(() => {
    const s = new Set([1, pages, p - 1, p, p + 1].filter((n) => n >= 1 && n <= pages));
    return [...s].sort((a, b) => a - b);
  }, [p, pages]);
  return (
    <nav aria-label={label ?? m.pagination} className={className}>
      <ul className="flex items-center">
        <li>
          <button type="button" aria-label={m.previousPage} disabled={p === 1} onClick={() => setP(p - 1)} className="inline-flex size-10 items-center justify-center rounded-box hover:bg-layer-hover disabled:text-placeholder">
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
              aria-label={m.page(n)}
              onClick={() => setP(n)}
              className={cn("relative inline-flex size-10 items-center justify-center rounded-box text-sm", n === p ? "bg-primary font-semibold text-on-color" : "text-ink-2 hover:bg-layer-hover hover:text-ink")}
            >
              {n}
            </button>
          </li>
        ))}
        <li>
          <button type="button" aria-label={m.nextPage} disabled={p >= pages} onClick={() => setP(p + 1)} className="inline-flex size-10 items-center justify-center rounded-box hover:bg-layer-hover disabled:text-placeholder">
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

/* ---------- menus ---------- */

export interface MenuItem {
  /** Defaults to the label. */
  id?: string;
  label: string;
  danger?: boolean;
  shortcut?: string;
  /** Renders a separator line instead of an item. */
  divider?: boolean;
  disabled?: boolean;
  /** Runs when this item is chosen, before the menu's onItemSelect. */
  onSelect?: () => void;
}

const pick = (it: MenuItem, onItemSelect?: (item: MenuItem) => void) => {
  it.onSelect?.();
  onItemSelect?.(it);
};

export function MenuList({ items, onItemSelect, label, className }: { items: readonly MenuItem[]; onItemSelect?: (item: MenuItem) => void; label: string; className?: string }) {
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
        if (e.key === "Home") els[0]?.focus();
        if (e.key === "End") els[els.length - 1]?.focus();
      }}
      className={cn("min-w-48 rounded-box border border-line bg-layer-2 p-1 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop", className)}
    >
      {items.map((it, n) =>
        it.divider ? (
          <li key={`d${n}`} role="separator" className="my-1 h-px bg-line" />
        ) : (
          <li
            key={it.id ?? it.label}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={it.disabled || undefined}
            onClick={() => !it.disabled && pick(it, onItemSelect)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !it.disabled) {
                e.preventDefault();
                pick(it, onItemSelect);
              }
            }}
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
    setTimeout(() => ref.current?.querySelector<HTMLElement>("[role=menuitem]:not([aria-disabled=true])")?.focus(), 0);
  };
  return { open, setOpen, ref, openAndFocus };
}

export interface OverflowMenuProps {
  items: readonly MenuItem[];
  label?: string;
  onItemSelect?: (item: MenuItem) => void;
  align?: "start" | "end";
  vertical?: boolean;
  className?: string;
}

export function OverflowMenu({ items, label, onItemSelect, align = "end", vertical = true, className }: OverflowMenuProps) {
  const m = useMessages();
  const { open, setOpen, ref, openAndFocus } = useMenu();
  const name = label ?? m.options;
  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={name}
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
            label={name}
            onItemSelect={(it) => {
              setOpen(false);
              onItemSelect?.(it);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function MenuButton({ label, items, kind = "primary", onItemSelect, className }: { label: string; items: readonly MenuItem[]; kind?: "primary" | "tertiary" | "ghost"; onItemSelect?: (item: MenuItem) => void; className?: string }) {
  const { open, setOpen, ref, openAndFocus } = useMenu();
  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
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
            onItemSelect={(it) => {
              setOpen(false);
              onItemSelect?.(it);
            }}
          />
        </div>
      )}
    </div>
  );
}

/** Opens a menu on right-click, or Shift + F10 / the Menu key, anywhere inside it. */
export function ContextMenuArea({ items, children, onItemSelect, label, className }: { items: readonly MenuItem[]; children: ReactNode; onItemSelect?: (item: MenuItem) => void; label?: string; className?: string }) {
  const m = useMessages();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useDismiss<HTMLDivElement>(!!pos, () => setPos(null));
  const focusFirst = () => setTimeout(() => ref.current?.querySelector<HTMLElement>("[role=menuitem]:not([aria-disabled=true])")?.focus(), 0);
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        focusFirst();
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
          e.preventDefault();
          setPos({ x: 24, y: 24 });
          focusFirst();
        }
      }}
    >
      {children}
      {pos && (
        <div className="absolute z-40" style={{ left: pos.x, top: pos.y }}>
          <MenuList
            items={items}
            label={label ?? m.contextMenu}
            onItemSelect={(it) => {
              setPos(null);
              onItemSelect?.(it);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function Menubar({ menus, onItemSelect, label, className }: { menus: readonly { label: string; items: readonly MenuItem[] }[]; onItemSelect?: (item: MenuItem, menu: string) => void; label?: string; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useDismiss<HTMLDivElement>(open !== null, () => setOpen(null));
  return (
    <div ref={ref} role="menubar" aria-label={label} className={cn("inline-flex h-10 items-center gap-0.5 rounded-box border border-line-2 bg-bg p-1", className)}>
      {menus.map((mn, i) => (
        <div key={mn.label} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => open !== null && setOpen(i)}
            className={cn("h-8 rounded-lg px-3 text-sm font-medium text-ink hover:bg-layer-hover", open === i && "bg-layer-hover")}
          >
            {mn.label}
          </button>
          {open === i && (
            <div className="absolute start-0 top-full z-40 mt-1.5">
              <MenuList
                items={mn.items}
                label={mn.label}
                onItemSelect={(it) => {
                  setOpen(null);
                  onItemSelect?.(it, mn.label);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export interface NavigationMenuItem {
  label: ReactNode;
  /** For a plain link with no panel. */
  href?: string;
  links?: readonly { title: ReactNode; body?: ReactNode; href: string }[];
}

export function NavigationMenu({ items, label, className }: { items: readonly NavigationMenuItem[]; label?: string; className?: string }) {
  const m = useMessages();
  const [open, setOpen] = useState<number | null>(null);
  const ref = useDismiss<HTMLElement>(open !== null, () => setOpen(null));
  const panel = open !== null ? items[open]?.links : undefined;
  return (
    <nav ref={ref} aria-label={label ?? m.mainNavigation} className={cn("relative", className)} onMouseLeave={() => setOpen(null)}>
      <ul className="flex items-center gap-1">
        {items.map((it, i) => (
          <li key={i}>
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
              <a href={it.href} className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-ink hover:bg-layer-hover">
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ul>
      {panel && (
        <div className="absolute start-0 top-full z-40 mt-1.5 w-[min(32rem,90vw)] rounded-box border border-line bg-layer-2 p-2 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop">
          <ul className="grid gap-1 sm:grid-cols-2">
            {panel.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(null)} className="block rounded-lg p-3 hover:bg-layer-hover">
                  <span className="block text-sm font-medium text-ink">{l.title}</span>
                  {l.body && <span className="mt-1 block text-sm text-ink-2">{l.body}</span>}
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

export interface CommandItem {
  id?: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  /** Extra words that match this item when searching. */
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandProps {
  groups: readonly { heading: string; items: readonly CommandItem[] }[];
  onItemSelect?: (item: CommandItem) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  className?: string;
}

export function Command({ groups, onItemSelect, placeholder, emptyText, className }: CommandProps) {
  const m = useMessages();
  const id = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const needle = q.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !needle || [i.label, ...(i.keywords ?? [])].some((w) => w.toLowerCase().includes(needle))) }))
    .filter((g) => g.items.length);
  const flat = filtered.flatMap((g) => g.items);
  const run = (it: CommandItem) => {
    if (it.disabled) return;
    it.onSelect?.();
    onItemSelect?.(it);
  };
  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-box border border-line bg-layer-2 shadow-[0_8px_24px_rgb(15_23_42/0.12)]", className)}>
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
            if (e.key === "Enter" && flat[active]) {
              e.preventDefault();
              run(flat[active]);
            }
          }}
          placeholder={placeholder ?? m.commandPlaceholder}
          aria-label={m.commandSearch}
          role="combobox"
          aria-expanded
          aria-controls={`${id}-list`}
          aria-activedescendant={flat[active] ? `${id}-o${active}` : undefined}
          className="h-11 flex-1 bg-transparent text-sm text-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>
      <div id={`${id}-list`} role="listbox" className="max-h-64 overflow-auto p-1">
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-ink-2">{emptyText ?? m.noMatches}</p>}
        {filtered.map((g) => (
          <div key={g.heading} role="group" aria-label={g.heading}>
            <p className="px-2 pb-1 pt-2 text-xs font-medium text-ink-2">{g.heading}</p>
            {g.items.map((it) => {
              const idx = flat.indexOf(it);
              return (
                <div
                  key={it.id ?? it.label}
                  id={`${id}-o${idx}`}
                  role="option"
                  aria-selected={idx === active}
                  aria-disabled={it.disabled || undefined}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => run(it)}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg px-2 text-sm [&>svg]:size-4 [&>svg]:text-ink-2",
                    it.disabled ? "cursor-not-allowed text-placeholder" : "cursor-pointer text-ink",
                    idx === active && "bg-layer-hover",
                  )}
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
      <div className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-ink-2">
        <span>{m.commandHint}</span>
        <span className="inline-flex items-center gap-1">
          <CornerDownLeft className="size-3" /> {m.commandRun}
        </span>
      </div>
    </div>
  );
}

/* ---------- UI shell ---------- */

export interface UIShellNavItem {
  /** Defaults to the label. */
  id?: string;
  label: string;
  href?: string;
}

export interface UIShellProps {
  product?: ReactNode;
  portal?: ReactNode;
  /** Where the product name links to. */
  homeHref?: string;
  headerLinks?: readonly { label: ReactNode; href: string }[];
  /** Buttons at the end of the header, for example <UIShellAction>. */
  actions?: ReactNode;
  navItems?: readonly UIShellNavItem[];
  /** Id of the current side-nav item. */
  activeItem?: string;
  defaultActiveItem?: string;
  onActiveItemChange?: (id: string) => void;
  navOpen?: boolean;
  defaultNavOpen?: boolean;
  onNavOpenChange?: (open: boolean) => void;
  /** The page content. */
  children?: ReactNode;
  className?: string;
}

/** An icon button styled for the UIShell header. */
export function UIShellAction({ label, icon, onClick }: { label: string; icon: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex size-12 items-center justify-center hover:bg-white/10 [&>svg]:size-5">
      {icon}
    </button>
  );
}

export function UIShell({
  product = "ScopeSky",
  portal,
  homeHref = "/",
  headerLinks,
  actions,
  navItems,
  activeItem,
  defaultActiveItem,
  onActiveItemChange,
  navOpen,
  defaultNavOpen = true,
  onNavOpenChange,
  children,
  className,
}: UIShellProps) {
  const m = useMessages();
  const [nav, setNav] = useControllableState(navOpen, defaultNavOpen, onNavOpenChange);
  const idOf = (l: UIShellNavItem) => l.id ?? l.label;
  const [active, setActive] = useControllableState(activeItem, defaultActiveItem ?? (navItems?.[0] ? idOf(navItems[0]) : ""), onActiveItemChange);
  const hasNav = !!navItems?.length;
  return (
    <div className={cn("flex w-full flex-col overflow-hidden rounded-box border border-line", className)}>
      <header className="flex h-12 shrink-0 items-center bg-[#161b22] text-[#f1f5f9]">
        {hasNav && (
          <button type="button" aria-label={nav ? m.closeMenu : m.openMenu} aria-expanded={nav} onClick={() => setNav(!nav)} className="inline-flex size-12 items-center justify-center hover:bg-white/10">
            <MenuIcon className="size-5" />
          </button>
        )}
        <a href={homeHref} className="flex h-full items-center gap-1 px-4 text-sm">
          <span className="font-semibold">{product}</span>
          {portal && <span className="text-[#cbd5e1]">{portal}</span>}
        </a>
        {headerLinks && headerLinks.length > 0 && (
          <nav aria-label={typeof portal === "string" ? portal : m.mainNavigation} className="hidden h-full md:flex">
            {headerLinks.map((l) => (
              <a key={l.href} href={l.href} className="flex h-full items-center px-4 text-sm text-[#cbd5e1] hover:bg-white/10 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
        )}
        {actions && <div className="ms-auto flex">{actions}</div>}
      </header>
      <div className="flex min-h-0 flex-1 bg-bg">
        {hasNav && nav && (
          <nav aria-label={m.sideNavigation} className="w-52 shrink-0 border-e border-line bg-layer py-2">
            {navItems!.map((l) => {
              const id = idOf(l);
              const cls = cn(
                "relative flex h-8 w-full items-center px-4 text-start text-sm",
                active === id ? "bg-layer-selected font-semibold text-ink before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-accent" : "text-ink-2 hover:bg-layer-hover hover:text-ink",
              );
              return l.href ? (
                <a key={id} href={l.href} aria-current={active === id ? "page" : undefined} onClick={() => setActive(id)} className={cls}>
                  {l.label}
                </a>
              ) : (
                <button key={id} type="button" aria-current={active === id ? "page" : undefined} onClick={() => setActive(id)} className={cls}>
                  {l.label}
                </button>
              );
            })}
          </nav>
        )}
        <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
