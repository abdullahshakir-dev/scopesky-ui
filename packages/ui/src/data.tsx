"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Folder,
  FolderOpen,
  ImageIcon,
  X,
} from "./icons.js";
import { cn } from "./utils.js";
import { CopyButton } from "./button.js";
import { Checkbox } from "./fields.js";
import { Tag, type TagType } from "./feedback.js";

/* ---------- kbd ---------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded-md border border-line-2 bg-layer px-1 font-sans text-[11px] font-medium text-ink-2 shadow-[inset_0_-1px_0_var(--border)]">
      {children}
    </kbd>
  );
}

/* ---------- data table ---------- */

export interface Row {
  id: string;
  customer: string;
  service: string;
  status: "Active" | "In progress" | "On hold" | "New";
  amount: number;
  date: string;
}

const statusTag: Record<Row["status"], TagType> = { Active: "green", "In progress": "warm", "On hold": "red", New: "blue" };

export const sampleRows: Row[] = [
  { id: "SR-20481", customer: "Al-Noor Clinic", service: "Business fiber 500", status: "Active", amount: 420, date: "2026-11-02" },
  { id: "SR-20477", customer: "Rafidain Logistics", service: "Dedicated line", status: "In progress", amount: 1250, date: "2026-10-28" },
  { id: "SR-20470", customer: "Dijla School", service: "Wi-Fi campus", status: "On hold", amount: 310, date: "2026-10-21" },
  { id: "SR-20466", customer: "Babel Pharmacy", service: "Business fiber 100", status: "Active", amount: 95, date: "2026-10-17" },
  { id: "SR-20459", customer: "Erbil Tech Hub", service: "Cloud backup", status: "New", amount: 180, date: "2026-10-09" },
  { id: "SR-20452", customer: "Kufa Hotel", service: "Guest Wi-Fi", status: "Active", amount: 260, date: "2026-10-03" },
];

type SortKey = keyof Row;

export function DataTable({
  rows = sampleRows,
  selectable = true,
  zebra = false,
  size = "lg",
  title = "Service requests",
  description = "Requests opened in the last 30 days.",
  tone = "grey",
}: {
  rows?: Row[];
  selectable?: boolean;
  zebra?: boolean;
  size?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  tone?: "grey" | "sky";
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const data = useMemo(() => {
    let d = rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()));
    if (sort) d = [...d].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * (sort.dir === "asc" ? 1 : -1));
    return d;
  }, [rows, sort, q]);
  const rowH = size === "sm" ? "h-8" : size === "md" ? "h-10" : "h-12";
  const cols: { key: SortKey; label: string; align?: "end" }[] = [
    { key: "id", label: "Request" },
    { key: "customer", label: "Customer" },
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Monthly (USD)", align: "end" },
  ];
  const all = data.length > 0 && data.every((r) => sel.includes(r.id));
  const some = data.some((r) => sel.includes(r.id));
  const sky = tone === "sky";
  return (
    <div className="w-full overflow-hidden rounded-box border border-line bg-bg">
      <div className="px-4 pb-4 pt-4">
        <h4 className="text-lg text-ink">{title}</h4>
        <p className="text-sm text-ink-2">{description}</p>
      </div>
      <div className={cn("flex h-12 items-center border-t border-line", sel.length ? "bg-primary text-on-color" : "bg-layer")}>
        {sel.length ? (
          <>
            <span className="flex-1 px-4 text-sm" aria-live="polite">
              {sel.length} item{sel.length > 1 ? "s" : ""} selected
            </span>
            <button type="button" className="h-full px-4 text-sm hover:bg-primary-hover">
              Export
            </button>
            <button type="button" onClick={() => setSel([])} className="h-full border-s border-white/30 px-4 text-sm hover:bg-primary-hover">
              Cancel
            </button>
          </>
        ) : (
          <label className="flex h-full flex-1 items-center gap-2 px-4 text-sm focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus">
            <span className="sr-only">Filter table</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter requests" className="h-full flex-1 bg-transparent text-ink placeholder:text-placeholder focus:outline-none" />
          </label>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className={cn(sky ? "bg-[#cdebfa] text-[#003044] dark:bg-tint-2 dark:text-ink" : "bg-layer-selected text-ink")}>
              {selectable && (
                <th className="w-12 ps-4 text-start">
                  <Checkbox label="Select all rows" hideLabel checked={all} indeterminate={!all && some} onChange={(c) => setSel(c ? data.map((r) => r.id) : [])} />
                </th>
              )}
              {cols.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th key={c.key} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"} className={cn("p-0 font-semibold", c.align === "end" ? "text-end" : "text-start")}>
                    <button
                      type="button"
                      onClick={() => setSort(active && sort!.dir === "desc" ? null : { key: c.key, dir: active ? "desc" : "asc" })}
                      className={cn("group flex w-full items-center gap-2 px-4 hover:bg-layer-hover focus-visible:outline-offset-[-2px]", rowH, c.align === "end" && "flex-row-reverse")}
                    >
                      {c.label}
                      {active ? sort!.dir === "asc" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" /> : <ArrowUpDown className="size-4 opacity-0 group-hover:opacity-60" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => {
              const on = sel.includes(r.id);
              return (
                <tr
                  key={r.id}
                  aria-selected={selectable ? on : undefined}
                  className={cn(
                    "border-t border-line text-ink-2 transition-colors",
                    on
                      ? sky
                        ? "bg-[#d6e5f0] text-ink shadow-[inset_3px_0_0_var(--accent)] hover:bg-[#ccdeeb] dark:bg-tint-2"
                        : "bg-layer-selected text-ink hover:bg-[#dae1e9] dark:hover:bg-layer-hover"
                      : zebra && i % 2 === 1
                        ? sky
                          ? "bg-[#eaf7fd] hover:bg-[#dfeaf3] dark:bg-tint"
                          : "bg-[#f1f5f9] hover:bg-[#eaeef3] dark:bg-layer-2"
                        : "hover:bg-layer-hover hover:text-ink",
                  )}
                >
                  {selectable && (
                    <td className="ps-4">
                      <Checkbox label={`Select ${r.id}`} hideLabel checked={on} onChange={(c) => setSel((s) => (c ? [...s, r.id] : s.filter((x) => x !== r.id)))} />
                    </td>
                  )}
                  <td className={cn("px-4 font-mono text-[13px] text-ink", rowH)}>{r.id}</td>
                  <td className="px-4">{r.customer}</td>
                  <td className="px-4">{r.service}</td>
                  <td className="px-4">
                    <Tag type={statusTag[r.status]}>{r.status}</Tag>
                  </td>
                  <td className="px-4 text-end tabular-nums">{r.amount.toLocaleString("en-US")}</td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-2">
                  No requests match “{q}”. Check the spelling or clear the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- lists ---------- */

export function StructuredList({ rows, selectable }: { rows: { plan: string; speed: string; price: string }[]; selectable?: boolean }) {
  const [v, setV] = useState(rows[0]?.plan);
  const name = useId();
  return (
    <div role={selectable ? "radiogroup" : "table"} aria-label="Plans" className="w-full text-sm">
      <div role={selectable ? undefined : "row"} className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-line-2 font-semibold text-ink">
        {["Plan", "Speed", "Price"].map((h) => (
          <span key={h} role={selectable ? undefined : "columnheader"} className="py-2 pe-4">
            {h}
          </span>
        ))}
        <span className="w-8" />
      </div>
      {rows.map((r) => (
        <label key={r.plan} role={selectable ? undefined : "row"} className={cn("grid grid-cols-[1fr_1fr_1fr_auto] items-center border-b border-line py-3 text-ink-2", selectable && "cursor-pointer hover:bg-layer-hover", selectable && v === r.plan && "text-ink")}>
          <span role={selectable ? undefined : "cell"} className="pe-4 font-semibold text-ink">
            {r.plan}
          </span>
          <span role={selectable ? undefined : "cell"} className="pe-4">
            {r.speed}
          </span>
          <span role={selectable ? undefined : "cell"} className="pe-4">
            {r.price}
          </span>
          <span className="w-8">
            {selectable && (
              <>
                <input type="radio" name={name} checked={v === r.plan} onChange={() => setV(r.plan)} className="peer sr-only" aria-label={r.plan} />
                <span className={cn("inline-flex size-4 items-center justify-center rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-focus", v === r.plan ? "bg-primary" : "")}>
                  {v === r.plan && <span className="text-[10px] text-bg">✓</span>}
                </span>
              </>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}

export function ContainedList({ label, items, action }: { label: string; items: string[]; action?: ReactNode }) {
  const [list, setList] = useState(items);
  return (
    <div className="w-full max-w-md overflow-hidden rounded-box border border-line bg-bg">
      <div className="flex h-12 items-center justify-between border-b border-line px-4">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {action}
      </div>
      <ul>
        {list.map((it) => (
          <li key={it} className="group flex h-12 items-center justify-between border-b border-line px-4 text-sm text-ink last:border-0 hover:bg-layer-hover">
            {it}
            <button type="button" aria-label={`Remove ${it}`} onClick={() => setList((l) => l.filter((x) => x !== it))} className="inline-flex size-8 items-center justify-center rounded-lg text-ink-2 opacity-60 hover:bg-layer-selected hover:text-ink group-hover:opacity-100 focus:opacity-100">
              <X className="size-4" />
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="px-4 py-6 text-sm text-ink-2">No contacts left. Add one to get updates.</li>}
      </ul>
    </div>
  );
}

export function List({ ordered, items }: { ordered?: boolean; items: (string | { text: string; children: string[] })[] }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("flex flex-col gap-2 ps-5 text-sm text-ink", ordered ? "list-decimal" : "list-[square] marker:text-ink-2")}>
      {items.map((it) =>
        typeof it === "string" ? (
          <li key={it}>{it}</li>
        ) : (
          <li key={it.text}>
            {it.text}
            <ul className="mt-2 flex list-[circle] flex-col gap-2 ps-5">
              {it.children.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </li>
        ),
      )}
    </Tag>
  );
}

type TreeNode = { label: string; children?: TreeNode[] };

export function TreeView({ nodes, label }: { nodes: TreeNode[]; label: string }) {
  const [open, setOpen] = useState<string[]>(["Contracts"]);
  const [sel, setSel] = useState("Contracts/2026");
  const render = (list: TreeNode[], depth: number, path: string): ReactNode =>
    list.map((n) => {
      const p = path ? `${path}/${n.label}` : n.label;
      const isOpen = open.includes(p);
      const kids = !!n.children?.length;
      return (
        <li key={p} role="treeitem" aria-expanded={kids ? isOpen : undefined} aria-selected={sel === p}>
          <button
            type="button"
            onClick={() => {
              setSel(p);
              if (kids) setOpen((o) => (isOpen ? o.filter((x) => x !== p) : [...o, p]));
            }}
            className={cn(
              "relative flex h-8 w-full items-center gap-2 pe-4 text-sm hover:bg-layer-hover focus-visible:outline-offset-[-2px]",
              sel === p ? "bg-layer-selected font-semibold text-ink before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-accent" : "text-ink-2",
            )}
            style={{ paddingInlineStart: 8 + depth * 20 }}
          >
            {kids ? <ChevronDown className={cn("size-4 transition-transform", !isOpen && "-rotate-90 rtl:rotate-90")} /> : <span className="w-4" />}
            {kids ? isOpen ? <FolderOpen className="size-4" /> : <Folder className="size-4" /> : <FileText className="size-4" />}
            {n.label}
          </button>
          {kids && isOpen && <ul role="group">{render(n.children!, depth + 1, p)}</ul>}
        </li>
      );
    });
  return (
    <ul role="tree" aria-label={label} className="w-full max-w-xs">
      {render(nodes, 0, "")}
    </ul>
  );
}

/* ---------- tiles, accordion ---------- */

export function Tile({ title, body, variant = "base", selected, onSelect }: { title: string; body: string; variant?: "base" | "clickable" | "selectable" | "expandable"; selected?: boolean; onSelect?: () => void }) {
  const [open, setOpen] = useState(false);
  const base = "relative block w-full min-h-28 overflow-hidden rounded-box border border-line bg-layer p-4 text-start text-sm transition-colors";
  if (variant === "clickable")
    return (
      <a href="#" onClick={(e) => e.preventDefault()} className={cn(base, "hover:bg-layer-hover")}>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-2 block text-ink-2">{body}</span>
        <ChevronRight aria-hidden className="absolute bottom-4 end-4 size-5 text-link rtl:rotate-180" />
      </a>
    );
  if (variant === "selectable")
    return (
      <button type="button" aria-pressed={selected} onClick={onSelect} className={cn(base, "hover:bg-layer-hover", selected && "border-primary outline-1 outline-offset-[-1px] outline-primary")}>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-2 block text-ink-2">{body}</span>
        <span aria-hidden className={cn("absolute end-4 top-4 size-4 rounded-[5px] border", selected ? "border-primary bg-primary" : "border-line-strong")}>
          {selected && <span className="flex size-full items-center justify-center text-[10px] text-white">✓</span>}
        </span>
      </button>
    );
  if (variant === "expandable")
    return (
      <div className={cn(base, "p-0")}>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-start justify-between p-4 text-start hover:bg-layer-hover">
          <span>
            <span className="block font-semibold text-ink">{title}</span>
            <span className="mt-2 block text-ink-2">{body}</span>
          </span>
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
        {open && <p className="px-4 pb-4 text-ink-2 animate-fade">Includes a static IP, priority repair within 4 hours and a monthly usage report.</p>}
      </div>
    );
  return (
    <div className={base}>
      <span className="block font-semibold text-ink">{title}</span>
      <span className="mt-2 block text-ink-2">{body}</span>
    </div>
  );
}

export function Accordion({ items, align = "end", size = "md", flush }: { items: { title: string; body: string }[]; align?: "start" | "end"; size?: "sm" | "md" | "lg"; flush?: boolean }) {
  const [open, setOpen] = useState<number[]>([0]);
  const id = useId();
  return (
    <ul className="w-full border-b border-line">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        return (
          <li key={it.title} className="border-t border-line">
            <h4>
              <button
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-c${i}`}
                onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== i) : [...o, i]))}
                className={cn(
                  "flex w-full items-center gap-3 text-start text-sm text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px]",
                  size === "sm" ? "min-h-8" : size === "md" ? "min-h-10" : "min-h-12",
                  flush && align === "start" ? "px-0" : "px-4",
                  align === "start" ? "flex-row" : "flex-row-reverse justify-between",
                )}
              >
                <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform duration-150", !isOpen && align === "start" && "-rotate-90 rtl:rotate-90", isOpen && "rotate-180", isOpen && align === "start" && "rotate-0")} />
                <span className="flex-1">{it.title}</span>
              </button>
            </h4>
            <div id={`${id}-c${i}`} role="region" aria-labelledby={`${id}-h${i}`} hidden={!isOpen} className={cn("pb-6 pt-2 text-sm text-ink-2", align === "start" ? "ps-11 pe-4" : "px-4 pe-16")}>
              {it.body}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- code snippet ---------- */

export function CodeSnippet({ type = "multi", code }: { type?: "inline" | "single" | "multi"; code: string }) {
  const [expanded, setExpanded] = useState(false);
  if (type === "inline")
    return (
      <code className="rounded-md bg-layer-selected px-1.5 py-0.5 font-mono text-[13px] text-ink" dir="ltr">
        {code}
      </code>
    );
  const lines = code.split("\n");
  const long = lines.length > 6;
  return (
    <div className="relative flex w-full max-w-xl overflow-hidden rounded-box border border-line bg-layer" dir="ltr">
      <pre className={cn("flex-1 overflow-x-auto p-4 pe-12 font-mono text-[13px] leading-5 text-ink", type === "single" && "whitespace-nowrap py-3", !expanded && long && "max-h-32 overflow-hidden")}>
        <code>{code}</code>
      </pre>
      <span className="absolute end-1 top-1">
        <CopyButton value={code} label="Copy code" />
      </span>
      {long && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="absolute bottom-1 end-1 inline-flex h-8 items-center gap-1 rounded-lg bg-layer px-2 text-xs text-ink hover:bg-layer-hover">
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
}

/* ---------- attachment, avatar, item ---------- */

export function Attachment({ name, meta, kind = "file", progress }: { name: string; meta: string; kind?: "file" | "image"; progress?: number }) {
  const [gone, setGone] = useState(false);
  if (gone) return <p className="text-sm text-ink-2">Attachment removed.</p>;
  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-box border border-line-2 bg-bg p-2 pe-1">
      <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-md", kind === "image" ? "bg-[linear-gradient(135deg,#9dd8f3,#006b9b)] text-white" : "bg-tint text-primary")}>
        {kind === "image" ? <ImageIcon className="size-5" /> : <File className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">{name}</span>
        <span className="block text-xs text-ink-2">{progress !== undefined && progress < 100 ? `Uploading… ${progress}%` : meta}</span>
        {progress !== undefined && progress < 100 && (
          <span className="mt-1 block h-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full bg-accent" style={{ width: `${progress}%` }} />
          </span>
        )}
      </span>
      <button type="button" aria-label={`Remove ${name}`} onClick={() => setGone(true)} className="inline-flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-layer-hover hover:text-ink">
        <X className="size-4" />
      </button>
    </div>
  );
}

const avatarTones = ["bg-[#cdebfa] text-[#004969]", "bg-[#defbe6] text-[#0e6027]", "bg-[#fcf4d6] text-[#8a3c04]", "bg-[#e2e8f0] text-[#1e293b]"];

export function Avatar({ name, size = "md", status, src }: { name: string; size?: "sm" | "md" | "lg"; status?: "online" | "away" | "offline"; src?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const tone = avatarTones[name.length % avatarTones.length];
  return (
    <span className="relative inline-flex shrink-0">
      <span role="img" aria-label={name} className={cn("inline-flex items-center justify-center overflow-hidden rounded-full font-medium", tone, size === "sm" ? "size-7 text-[11px]" : size === "md" ? "size-9 text-sm" : "size-12 text-base")}>
        {src ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} /> : initials}
      </span>
      {status && (
        <span aria-label={status} className={cn("absolute bottom-0 end-0 size-2.5 rounded-full ring-2 ring-[var(--background)]", status === "online" ? "bg-success" : status === "away" ? "bg-warning" : "bg-line-strong")} />
      )}
    </span>
  );
}

export function AvatarGroup({ names }: { names: string[] }) {
  return (
    <span className="flex -space-x-2 rtl:space-x-reverse">
      {names.slice(0, 3).map((n) => (
        <span key={n} className="rounded-full ring-2 ring-[var(--background)]">
          <Avatar name={n} size="sm" />
        </span>
      ))}
      {names.length > 3 && <span className="inline-flex size-7 items-center justify-center rounded-full bg-layer-selected text-[11px] text-ink ring-2 ring-[var(--background)]">+{names.length - 3}</span>}
    </span>
  );
}

export function Item({ media, title, description, actions, variant = "outline" }: { media?: ReactNode; title: string; description?: string; actions?: ReactNode; variant?: "default" | "outline" | "muted" }) {
  return (
    <div className={cn("flex w-full items-center gap-4 rounded-box p-4", variant === "outline" && "border border-line-2", variant === "muted" && "bg-layer")}>
      {media}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && <p className="mt-0.5 text-sm text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- carousel ---------- */

export function Carousel({ slides }: { slides: { title: string; body: string }[] }) {
  const [i, setI] = useState(0);
  return (
    <section aria-roledescription="carousel" aria-label="Plans" className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-box border border-line-2">
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(${-i * 100}%)` }}>
          {slides.map((s, n) => (
            <div key={s.title} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}`} aria-hidden={n !== i} className="flex h-44 w-full shrink-0 flex-col justify-end bg-[linear-gradient(160deg,var(--tint)_0%,var(--layer)_70%)] p-6">
              <p className="text-2xl text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden>
          {slides.map((s, n) => (
            <span key={s.title} className={cn("h-1.5 rounded-full transition-all", n === i ? "w-6 bg-primary" : "w-1.5 bg-line-2")} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous slide" disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex size-8 items-center justify-center rounded-full border border-line-2 text-ink hover:bg-layer-hover disabled:opacity-40">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next slide" disabled={i === slides.length - 1} onClick={() => setI(i + 1)} className="inline-flex size-8 items-center justify-center rounded-full border border-line-2 text-ink hover:bg-layer-hover disabled:opacity-40">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- chart ---------- */

export function BarChart({ data, label }: { data: { label: string; a: number; b: number }[]; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.flatMap((d) => [d.a, d.b]));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  return (
    <figure className="w-full max-w-xl rounded-box border border-line-2 bg-bg p-4">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span>
          <span className="block text-sm font-semibold text-ink">{label}</span>
          <span className="block text-xs text-ink-2">Jun – Nov 2026</span>
        </span>
        <span className="flex gap-4 text-xs text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-primary" /> Business
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-[#65c0e9]" /> Home
          </span>
        </span>
      </figcaption>
      <div className="relative mt-4 h-48" dir="ltr">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-8 border-t border-line" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -start-8 -top-2 w-6 text-end text-[10px] text-ink-3">{t}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 end-0 start-8 flex items-end justify-around">
          {data.map((d, i) => (
            <div key={d.label} className="relative flex h-full flex-1 items-end justify-center gap-1" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <span className="w-3 rounded-t-[2px] bg-primary transition-opacity sm:w-4" style={{ height: `${(d.a / max) * 100}%`, opacity: hover === null || hover === i ? 1 : 0.4 }} />
              <span className="w-3 rounded-t-[2px] bg-[#65c0e9] transition-opacity sm:w-4" style={{ height: `${(d.b / max) * 100}%`, opacity: hover === null || hover === i ? 1 : 0.4 }} />
              {hover === i && (
                <span className="absolute bottom-full z-10 mb-1 w-max rounded-md border border-line bg-layer-2 px-2 py-1 text-xs text-ink shadow-md">
                  <b>{d.label}</b> · Business {d.a} · Home {d.b}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="ms-8 mt-2 flex justify-around text-xs text-ink-2" dir="ltr">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th>{d.label}</th>
              <td>Business {d.a}</td>
              <td>Home {d.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
