"use client";

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
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
import { Skeleton } from "./feedback.js";
import { useControllableState } from "./hooks.js";
import { useMessages } from "./locale.js";

/* ---------- kbd ---------- */

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded-md border border-line-2 bg-layer px-1 font-sans text-[11px] font-medium text-ink-2 shadow-[inset_0_-1px_0_var(--border)]", className)}>
      {children}
    </kbd>
  );
}

/* ---------- data table ---------- */

export interface DataTableColumn<T> {
  /** Unique per table. Also the field read from each row when `value` isn't given. */
  key: string;
  header: ReactNode;
  /** The value used to sort and filter. Defaults to row[key]. */
  value?: (row: T) => unknown;
  /** What the cell shows. Defaults to the value as text. */
  cell?: (row: T) => ReactNode;
  /** Defaults to true. */
  sortable?: boolean;
  align?: "start" | "end";
  className?: string;
}

export type SortDirection = "asc" | "desc";
export type SortState = { key: string; direction: SortDirection } | null;

export interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  data: readonly T[];
  /** A stable id per row. Defaults to row.id, then the row's index. */
  getRowId?: (row: T, index: number) => string;
  title?: ReactNode;
  description?: ReactNode;
  /** Accessible name when there is no title. */
  label?: string;

  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Buttons shown in the toolbar while rows are selected. Plain <button>s get the toolbar styling. */
  batchActions?: (selected: T[], clearSelection: () => void) => ReactNode;

  /** Shows the filter box. Defaults to true. */
  filterable?: boolean;
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterPlaceholder?: string;

  sort?: SortState;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;

  /**
   * Leave filtering and sorting to you, for example on the server: the table
   * shows `data` as given and only reports filter / sort changes.
   */
  manual?: boolean;
  /** Extra controls at the end of the toolbar, such as an Export or Add button. */
  toolbar?: ReactNode;
  /** Shows placeholder rows while data loads. */
  loading?: boolean;
  /** Shown when there are no rows and no filter is set. */
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;

  size?: "sm" | "md" | "lg";
  zebra?: boolean;
  tone?: "grey" | "sky";
  className?: string;
}

const readKey = <T,>(row: T, key: string) => (row as Record<string, unknown> | null)?.[key];

const asText = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return v.toLocaleString();
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
};

const compare = (a: unknown, b: unknown) => {
  if (a === b) return 0;
  if (a === null || a === undefined || a === "") return 1;
  if (b === null || b === undefined || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

const NO_IDS: string[] = [];

export function DataTable<T>({
  columns,
  data,
  getRowId,
  title,
  description,
  label,
  selectable = false,
  selectedIds,
  defaultSelectedIds = NO_IDS,
  onSelectionChange,
  batchActions,
  filterable = true,
  filter,
  defaultFilter = "",
  onFilterChange,
  filterPlaceholder,
  sort,
  defaultSort = null,
  onSortChange,
  manual = false,
  toolbar,
  loading = false,
  emptyState,
  onRowClick,
  size = "lg",
  zebra = false,
  tone = "grey",
  className,
}: DataTableProps<T>) {
  const m = useMessages();
  const titleId = useId();
  const [sortState, setSort] = useControllableState<SortState>(sort, defaultSort, onSortChange);
  const [sel, setSel] = useControllableState(selectedIds, defaultSelectedIds, onSelectionChange);
  const [q, setQ] = useControllableState(filter, defaultFilter, onFilterChange);

  const rowId = (row: T, i: number) => {
    if (getRowId) return getRowId(row, i);
    const id = readKey(row, "id");
    return typeof id === "string" || typeof id === "number" ? String(id) : String(i);
  };
  const valueOf = (c: DataTableColumn<T>, row: T) => (c.value ? c.value(row) : readKey(row, c.key));

  const rows = useMemo(() => {
    let d = data.map((row, i) => ({ row, id: rowId(row, i) }));
    if (manual) return d;
    const needle = q.trim().toLowerCase();
    if (needle) d = d.filter(({ row }) => columns.some((c) => asText(valueOf(c, row)).toLowerCase().includes(needle)));
    const col = sortState && columns.find((c) => c.key === sortState.key);
    if (col && sortState) {
      const dir = sortState.direction === "asc" ? 1 : -1;
      d = [...d].sort((a, b) => compare(valueOf(col, a.row), valueOf(col, b.row)) * dir);
    }
    return d;
    // rowId / valueOf only read props that are already listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, q, sortState, manual, getRowId]);

  const rowH = size === "sm" ? "h-8" : size === "md" ? "h-10" : "h-12";
  const visibleIds = rows.map((r) => r.id);
  const all = visibleIds.length > 0 && visibleIds.every((id) => sel.includes(id));
  const some = visibleIds.some((id) => sel.includes(id));
  const selectedRows = data.filter((row, i) => sel.includes(rowId(row, i)));
  const clear = () => setSel([]);
  const sky = tone === "sky";
  const colCount = columns.length + (selectable ? 1 : 0);
  const showToolbar = filterable || !!toolbar || (selectable && sel.length > 0);

  return (
    <div className={cn("w-full overflow-hidden rounded-box border border-line bg-bg", className)}>
      {(title || description) && (
        <div className="px-4 pb-4 pt-4">
          {title && (
            <p id={titleId} className="text-lg text-ink">
              {title}
            </p>
          )}
          {description && <p className="text-sm text-ink-2">{description}</p>}
        </div>
      )}
      {showToolbar && (
        <div className={cn("flex h-12 items-center border-t border-line", selectable && sel.length ? "bg-primary text-on-color" : "bg-layer")}>
          {selectable && sel.length ? (
            <>
              <span className="flex-1 px-4 text-sm" aria-live="polite">
                {m.itemsSelected(sel.length)}
              </span>
              {batchActions && (
                <div className="flex h-full [&>button]:h-full [&>button]:px-4 [&>button]:text-sm [&>button:hover]:bg-primary-hover">{batchActions(selectedRows, clear)}</div>
              )}
              <button type="button" onClick={clear} className="h-full border-s border-white/30 px-4 text-sm hover:bg-primary-hover">
                {m.cancel}
              </button>
            </>
          ) : (
            <>
              {filterable ? (
                <label className="flex h-full flex-1 items-center gap-2 px-4 text-sm focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus">
                  <span className="sr-only">{m.filterTable}</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={filterPlaceholder ?? m.filterPlaceholder} className="h-full flex-1 bg-transparent text-ink placeholder:text-placeholder focus:outline-none" />
                </label>
              ) : (
                <span className="flex-1" />
              )}
              {toolbar && <div className="flex h-full items-center gap-2 pe-2">{toolbar}</div>}
            </>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : label}
          aria-busy={loading || undefined}
          className="w-full border-collapse text-sm"
        >
          <thead>
            <tr className={cn(sky ? "bg-[#cdebfa] text-[#003044] dark:bg-tint-2 dark:text-ink" : "bg-layer-selected text-ink")}>
              {selectable && (
                <th className="w-12 ps-4 text-start">
                  <Checkbox
                    label={m.selectAllRows}
                    hideLabel
                    checked={all}
                    indeterminate={!all && some}
                    onCheckedChange={(c) => setSel(c ? [...new Set([...sel, ...visibleIds])] : sel.filter((id) => !visibleIds.includes(id)))}
                  />
                </th>
              )}
              {columns.map((c) => {
                const active = sortState?.key === c.key;
                const canSort = c.sortable !== false;
                return (
                  <th
                    key={c.key}
                    aria-sort={canSort ? (active ? (sortState!.direction === "asc" ? "ascending" : "descending") : "none") : undefined}
                    className={cn("p-0 font-semibold", c.align === "end" ? "text-end" : "text-start", c.className)}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={() => setSort(active && sortState!.direction === "desc" ? null : { key: c.key, direction: active ? "desc" : "asc" })}
                        className={cn("group flex w-full items-center gap-2 whitespace-nowrap px-4 hover:bg-layer-hover focus-visible:outline-offset-[-2px]", rowH, c.align === "end" && "flex-row-reverse")}
                      >
                        {c.header}
                        {active ? sortState!.direction === "asc" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" /> : <ArrowUpDown className="size-4 opacity-0 group-hover:opacity-60" />}
                      </button>
                    ) : (
                      <span className={cn("flex items-center whitespace-nowrap px-4", rowH, c.align === "end" && "justify-end")}>{c.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }, (_, i) => (
                <tr key={`sk${i}`} className="border-t border-line">
                  {Array.from({ length: colCount }, (_, j) => (
                    <td key={j} className={cn("px-4", rowH)}>
                      <Skeleton className="h-3 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              rows.map(({ row, id }, i) => {
                const on = sel.includes(id);
                return (
                  <tr
                    key={id}
                    aria-selected={selectable ? on : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "border-t border-line text-ink-2 transition-colors",
                      onRowClick && "cursor-pointer",
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
                      <td className="ps-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox label={m.selectRow(id)} hideLabel checked={on} onCheckedChange={(c) => setSel(c ? [...sel, id] : sel.filter((x) => x !== id))} />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4", rowH, c.align === "end" && "text-end tabular-nums", c.className)}>
                        {c.cell ? c.cell(row) : asText(valueOf(c, row))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-ink-2">
                  {q ? m.noResultsFor(q) : (emptyState ?? m.noData)}
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

export interface StructuredListColumn<T> {
  key: string;
  header: ReactNode;
  /** Defaults to row[key] as text. */
  cell?: (row: T) => ReactNode;
}

export interface StructuredListProps<T> {
  columns: readonly StructuredListColumn<T>[];
  rows: readonly T[];
  getRowId?: (row: T, index: number) => string;
  /** Lets the user pick one row, like a radio group. */
  selectable?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string) => void;
  /** Radio name, so the chosen row id is sent with a form. */
  name?: string;
  label?: string;
  className?: string;
}

export function StructuredList<T>({ columns, rows, getRowId, selectable, value, defaultValue = null, onValueChange, name: nameProp, label, className }: StructuredListProps<T>) {
  const auto = useId();
  const name = nameProp ?? auto;
  const [v, setV] = useControllableState<string | null>(value, defaultValue, onValueChange as (v: string | null) => void);
  const idOf = (row: T, i: number) => {
    if (getRowId) return getRowId(row, i);
    const id = readKey(row, "id");
    return typeof id === "string" || typeof id === "number" ? String(id) : String(i);
  };
  const grid: CSSProperties = { gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) auto` };
  const cellRole = selectable ? undefined : "cell";
  return (
    <div role={selectable ? "radiogroup" : "table"} aria-label={label} className={cn("w-full text-sm", className)}>
      <div role={selectable ? undefined : "row"} style={grid} className="grid border-b border-line-2 font-semibold text-ink">
        {columns.map((c) => (
          <span key={c.key} role={selectable ? undefined : "columnheader"} className="py-2 pe-4">
            {c.header}
          </span>
        ))}
        <span className="w-8" />
      </div>
      {rows.map((r, i) => {
        const id = idOf(r, i);
        const on = v === id;
        const Row = selectable ? "label" : "div";
        return (
          <Row key={id} role={selectable ? undefined : "row"} style={grid} className={cn("grid items-center border-b border-line py-3 text-ink-2", selectable && "cursor-pointer hover:bg-layer-hover", on && "text-ink")}>
            {columns.map((c, j) => (
              <span key={c.key} role={cellRole} className={cn("pe-4", j === 0 && "font-semibold text-ink")}>
                {c.cell ? c.cell(r) : asText(readKey(r, c.key))}
              </span>
            ))}
            <span className="w-8">
              {selectable && (
                <>
                  <input type="radio" name={name} value={id} checked={on} onChange={() => setV(id)} className="peer sr-only" aria-label={asText(readKey(r, columns[0]?.key ?? "")) || id} />
                  <span className={cn("inline-flex size-4 items-center justify-center rounded-full border peer-focus-visible:outline-2 peer-focus-visible:outline-focus", on ? "border-primary bg-primary" : "border-line-strong")}>
                    {on && <span className="size-1.5 rounded-full bg-bg" />}
                  </span>
                </>
              )}
            </span>
          </Row>
        );
      })}
    </div>
  );
}

export type ContainedListItem = string | { id: string; label: ReactNode };

export function ContainedList({
  label,
  items,
  action,
  onRemove,
  emptyText,
  className,
}: {
  label: ReactNode;
  items: readonly ContainedListItem[];
  action?: ReactNode;
  /** Shows a remove button on each row. Remove the item from `items` in here. */
  onRemove?: (id: string) => void;
  emptyText?: ReactNode;
  className?: string;
}) {
  const m = useMessages();
  const list = items.map((it) => (typeof it === "string" ? { id: it, label: it } : it));
  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-box border border-line bg-bg", className)}>
      <div className="flex h-12 items-center justify-between border-b border-line px-4">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {action}
      </div>
      <ul>
        {list.map((it) => (
          <li key={it.id} className="group flex h-12 items-center justify-between border-b border-line px-4 text-sm text-ink last:border-0 hover:bg-layer-hover">
            {it.label}
            {onRemove && (
              <button
                type="button"
                aria-label={m.remove(typeof it.label === "string" ? it.label : it.id)}
                onClick={() => onRemove(it.id)}
                className="inline-flex size-8 items-center justify-center rounded-lg text-ink-2 opacity-60 hover:bg-layer-selected hover:text-ink group-hover:opacity-100 focus:opacity-100"
              >
                <X className="size-4" />
              </button>
            )}
          </li>
        ))}
        {list.length === 0 && <li className="px-4 py-6 text-sm text-ink-2">{emptyText ?? m.emptyList}</li>}
      </ul>
    </div>
  );
}

export type ListItem = ReactNode | { text: ReactNode; children: ReactNode[] };

const isNested = (it: ListItem): it is { text: ReactNode; children: ReactNode[] } =>
  !!it && typeof it === "object" && "text" in it && "children" in it && Array.isArray((it as { children: unknown }).children);

export function List({ ordered, items, className }: { ordered?: boolean; items: readonly ListItem[]; className?: string }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("flex flex-col gap-2 ps-5 text-sm text-ink", ordered ? "list-decimal" : "list-[square] marker:text-ink-2", className)}>
      {items.map((it, i) =>
        isNested(it) ? (
          <li key={i}>
            {it.text}
            <ul className="mt-2 flex list-[circle] flex-col gap-2 ps-5">
              {it.children.map((c, j) => (
                <li key={j}>{c}</li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={i}>{it as ReactNode}</li>
        ),
      )}
    </Tag>
  );
}

export type TreeNode = { id?: string; label: string; children?: TreeNode[] };

export interface TreeViewProps {
  nodes: readonly TreeNode[];
  label: string;
  /** Ids of open folders. A node's id is its `id`, or its labels joined with "/". */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string, node: TreeNode) => void;
  className?: string;
}

export function TreeView({ nodes, label, expanded, defaultExpanded = NO_IDS, onExpandedChange, selected, defaultSelected = null, onSelectedChange, className }: TreeViewProps) {
  const [open, setOpen] = useControllableState(expanded, defaultExpanded, onExpandedChange);
  const [sel, setSelState] = useControllableState<string | null>(selected, defaultSelected);
  const render = (list: readonly TreeNode[], depth: number, path: string): ReactNode =>
    list.map((n) => {
      const p = path ? `${path}/${n.label}` : n.label;
      const id = n.id ?? p;
      const isOpen = open.includes(id);
      const kids = !!n.children?.length;
      return (
        <li key={id} role="treeitem" aria-expanded={kids ? isOpen : undefined} aria-selected={sel === id}>
          <button
            type="button"
            onClick={() => {
              setSelState(id);
              onSelectedChange?.(id, n);
              if (kids) setOpen((o) => (isOpen ? o.filter((x) => x !== id) : [...o, id]));
            }}
            className={cn(
              "relative flex h-8 w-full items-center gap-2 pe-4 text-sm hover:bg-layer-hover focus-visible:outline-offset-[-2px]",
              sel === id ? "bg-layer-selected font-semibold text-ink before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-accent" : "text-ink-2",
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
    <ul role="tree" aria-label={label} className={cn("w-full max-w-xs", className)}>
      {render(nodes, 0, "")}
    </ul>
  );
}

/* ---------- tiles, accordion ---------- */

export interface TileProps {
  title: ReactNode;
  body?: ReactNode;
  variant?: "base" | "clickable" | "selectable" | "expandable";
  /** clickable: renders a link. */
  href?: string;
  target?: string;
  /** clickable: renders a button when there is no href. */
  onClick?: () => void;
  /** selectable */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** expandable */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** expandable: the content shown when open. */
  children?: ReactNode;
  className?: string;
}

export function Tile({
  title,
  body,
  variant = "base",
  href,
  target,
  onClick,
  selected,
  defaultSelected = false,
  onSelectedChange,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: TileProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const [isSel, setSel] = useControllableState(selected, defaultSelected, onSelectedChange);
  const base = cn("relative block w-full min-h-28 overflow-hidden rounded-box border border-line bg-layer p-4 text-start text-sm transition-colors", className);
  const text = (
    <>
      <span className="block font-semibold text-ink">{title}</span>
      {body && <span className="mt-2 block text-ink-2">{body}</span>}
    </>
  );
  if (variant === "clickable") {
    const arrow = <ChevronRight aria-hidden className="absolute bottom-4 end-4 size-5 text-link rtl:rotate-180" />;
    return href ? (
      <a href={href} target={target} onClick={onClick} className={cn(base, "hover:bg-layer-hover")}>
        {text}
        {arrow}
      </a>
    ) : (
      <button type="button" onClick={onClick} className={cn(base, "hover:bg-layer-hover")}>
        {text}
        {arrow}
      </button>
    );
  }
  if (variant === "selectable")
    return (
      <button type="button" aria-pressed={isSel} onClick={() => setSel(!isSel)} className={cn(base, "hover:bg-layer-hover", isSel && "border-primary outline-1 outline-offset-[-1px] outline-primary")}>
        {text}
        <span aria-hidden className={cn("absolute end-4 top-4 inline-flex size-4 items-center justify-center rounded-[5px] border text-white", isSel ? "border-primary bg-primary" : "border-line-strong")}>
          {isSel && <Check className="size-3" strokeWidth={3} />}
        </span>
      </button>
    );
  if (variant === "expandable")
    return (
      <div className={cn(base, "p-0")}>
        <button type="button" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} className="flex w-full items-start justify-between p-4 text-start hover:bg-layer-hover">
          <span>{text}</span>
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && children && <div className="px-4 pb-4 text-ink-2 animate-fade">{children}</div>}
      </div>
    );
  return <div className={base}>{text}</div>;
}

export interface AccordionItem {
  /** Defaults to the item's index. */
  id?: string;
  title: ReactNode;
  body: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  /** Ids of the open items. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (ids: string[]) => void;
  /** Allow more than one open item. Defaults to true. */
  multiple?: boolean;
  align?: "start" | "end";
  size?: "sm" | "md" | "lg";
  flush?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function Accordion({ items, value, defaultValue = NO_IDS, onValueChange, multiple = true, align = "end", size = "md", flush, headingLevel = 4, className }: AccordionProps) {
  const [open, setOpen] = useControllableState(value, defaultValue, onValueChange);
  const id = useId();
  const H = `h${headingLevel}` as "h4";
  return (
    <ul className={cn("w-full border-b border-line", className)}>
      {items.map((it, i) => {
        const key = it.id ?? String(i);
        const isOpen = open.includes(key);
        return (
          <li key={key} className="border-t border-line">
            <H>
              <button
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-c${i}`}
                disabled={it.disabled}
                onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== key) : multiple ? [...o, key] : [key]))}
                className={cn(
                  "flex w-full items-center gap-3 text-start text-sm text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-placeholder",
                  size === "sm" ? "min-h-8" : size === "md" ? "min-h-10" : "min-h-12",
                  flush && align === "start" ? "px-0" : "px-4",
                  align === "start" ? "flex-row" : "flex-row-reverse justify-between",
                )}
              >
                <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform duration-150", !isOpen && align === "start" && "-rotate-90 rtl:rotate-90", isOpen && "rotate-180", isOpen && align === "start" && "rotate-0")} />
                <span className="flex-1">{it.title}</span>
              </button>
            </H>
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

export function CodeSnippet({ type = "multi", code, className }: { type?: "inline" | "single" | "multi"; code: string; className?: string }) {
  const m = useMessages();
  const [expanded, setExpanded] = useState(false);
  if (type === "inline")
    return (
      <code className={cn("rounded-md bg-layer-selected px-1.5 py-0.5 font-mono text-[13px] text-ink", className)} dir="ltr">
        {code}
      </code>
    );
  const lines = code.split("\n");
  const long = lines.length > 6;
  return (
    <div className={cn("relative flex w-full max-w-xl overflow-hidden rounded-box border border-line bg-layer", className)} dir="ltr">
      <pre className={cn("flex-1 overflow-x-auto p-4 pe-12 font-mono text-[13px] leading-5 text-ink", type === "single" && "whitespace-nowrap py-3", !expanded && long && "max-h-32 overflow-hidden")}>
        <code>{code}</code>
      </pre>
      <span className="absolute end-1 top-1">
        <CopyButton value={code} label={m.copyCode} />
      </span>
      {long && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="absolute bottom-1 end-1 inline-flex h-8 items-center gap-1 rounded-lg bg-layer px-2 text-xs text-ink hover:bg-layer-hover">
          {expanded ? m.showLess : m.showMore}
          <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
}

/* ---------- attachment, avatar, item ---------- */

export function Attachment({
  name,
  meta,
  kind = "file",
  progress,
  onRemove,
  className,
}: {
  name: string;
  meta?: ReactNode;
  kind?: "file" | "image";
  /** 0–100. Shows a progress bar until it reaches 100. */
  progress?: number;
  /** Shows a remove button. */
  onRemove?: () => void;
  className?: string;
}) {
  const m = useMessages();
  const busy = progress !== undefined && progress < 100;
  return (
    <div className={cn("flex w-full max-w-sm items-center gap-3 rounded-box border border-line-2 bg-bg p-2 pe-1", className)}>
      <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-md", kind === "image" ? "bg-[linear-gradient(135deg,#9dd8f3,#006b9b)] text-white" : "bg-tint text-primary")}>
        {kind === "image" ? <ImageIcon className="size-5" /> : <File className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">{name}</span>
        <span className="block text-xs text-ink-2">{busy ? `${m.uploading}… ${progress}%` : meta}</span>
        {busy && (
          <span className="mt-1 block h-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full bg-accent" style={{ width: `${progress}%` }} />
          </span>
        )}
      </span>
      {onRemove && (
        <button type="button" aria-label={m.remove(name)} onClick={onRemove} className="inline-flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-layer-hover hover:text-ink">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

const avatarTones = ["bg-[#cdebfa] text-[#004969]", "bg-[#defbe6] text-[#0e6027]", "bg-[#fcf4d6] text-[#8a3c04]", "bg-[#e2e8f0] text-[#1e293b]"];

export function Avatar({ name, size = "md", status, src, className }: { name: string; size?: "sm" | "md" | "lg"; status?: "online" | "away" | "offline"; src?: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const tone = avatarTones[name.length % avatarTones.length];
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span role="img" aria-label={name} className={cn("inline-flex items-center justify-center overflow-hidden rounded-full font-medium", tone, size === "sm" ? "size-7 text-[11px]" : size === "md" ? "size-9 text-sm" : "size-12 text-base")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a library component; apps pick their own image loader */}
        {src ? <img src={src} alt="" className="size-full object-cover" /> : initials}
      </span>
      {status && (
        <span role="img" aria-label={status} className={cn("absolute bottom-0 end-0 size-2.5 rounded-full ring-2 ring-[var(--background)]", status === "online" ? "bg-success" : status === "away" ? "bg-warning" : "bg-line-strong")} />
      )}
    </span>
  );
}

export function AvatarGroup({ names, max = 3, className }: { names: readonly string[]; max?: number; className?: string }) {
  return (
    <span className={cn("flex -space-x-2 rtl:space-x-reverse", className)}>
      {names.slice(0, max).map((n, i) => (
        <span key={`${n}-${i}`} className="rounded-full ring-2 ring-[var(--background)]">
          <Avatar name={n} size="sm" />
        </span>
      ))}
      {names.length > max && <span className="inline-flex size-7 items-center justify-center rounded-full bg-layer-selected text-[11px] text-ink ring-2 ring-[var(--background)]">+{names.length - max}</span>}
    </span>
  );
}

export function Item({
  media,
  title,
  description,
  actions,
  variant = "outline",
  className,
}: {
  media?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "outline" | "muted";
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center gap-4 rounded-box p-4", variant === "outline" && "border border-line-2", variant === "muted" && "bg-layer", className)}>
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

export interface CarouselProps {
  slides: readonly { title: ReactNode; body?: ReactNode }[];
  label?: string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

export function Carousel({ slides, label, index, defaultIndex = 0, onIndexChange, className }: CarouselProps) {
  const m = useMessages();
  const [i, setI] = useControllableState(index, defaultIndex, onIndexChange);
  return (
    <section aria-roledescription="carousel" aria-label={label ?? m.carousel} className={cn("w-full max-w-md", className)}>
      <div className="relative overflow-hidden rounded-box border border-line-2">
        <div className="flex transition-transform duration-300 ease-out rtl:[--dir:-1]" style={{ transform: `translateX(calc(${-i * 100}% * var(--dir, 1)))` }}>
          {slides.map((s, n) => (
            <div key={n} role="group" aria-roledescription="slide" aria-label={m.slideOf(n + 1, slides.length)} aria-hidden={n !== i} className="flex h-44 w-full shrink-0 flex-col justify-end bg-[linear-gradient(160deg,var(--tint)_0%,var(--layer)_70%)] p-6">
              <p className="text-2xl text-ink">{s.title}</p>
              {s.body && <p className="mt-1 text-sm text-ink-2">{s.body}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden>
          {slides.map((_, n) => (
            <span key={n} className={cn("h-1.5 rounded-full transition-all", n === i ? "w-6 bg-primary" : "w-1.5 bg-line-2")} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label={m.previousSlide} disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex size-8 items-center justify-center rounded-full border border-line-2 text-ink hover:bg-layer-hover disabled:opacity-40">
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <button type="button" aria-label={m.nextSlide} disabled={i === slides.length - 1} onClick={() => setI(i + 1)} className="inline-flex size-8 items-center justify-center rounded-full border border-line-2 text-ink hover:bg-layer-hover disabled:opacity-40">
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- chart ---------- */

export interface BarSeries<T> {
  /** The field in each data row that holds this series' number. */
  key: keyof T & string;
  label: string;
  /** Any CSS color. Defaults to the ScopeSky series colors. */
  color?: string;
}

export interface BarChartProps<T> {
  data: readonly T[];
  /** The field holding each bar group's label (the x axis). */
  categoryKey: keyof T & string;
  series: readonly BarSeries<T>[];
  label: ReactNode;
  /** A line under the label, such as the date range. */
  description?: ReactNode;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const seriesColors = ["var(--primary)", "#65c0e9", "#24a148", "#f1c21b", "#8a3ffc", "#fa4d56"];

export function BarChart<T>({ data, categoryKey, series, label, description, valueFormatter = (n) => n.toLocaleString(), className }: BarChartProps<T>) {
  const [hover, setHover] = useState<number | null>(null);
  const num = (row: T, key: string) => {
    const v = Number(readKey(row, key));
    return Number.isFinite(v) ? v : 0;
  };
  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => num(d, s.key))));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);
  const color = (i: number) => series[i].color ?? seriesColors[i % seriesColors.length];
  return (
    <figure className={cn("w-full max-w-xl rounded-box border border-line-2 bg-bg p-4", className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span>
          <span className="block text-sm font-semibold text-ink">{label}</span>
          {description && <span className="block text-xs text-ink-2">{description}</span>}
        </span>
        <span className="flex flex-wrap gap-4 text-xs text-ink-2">
          {series.map((s, i) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px]" style={{ background: color(i) }} /> {s.label}
            </span>
          ))}
        </span>
      </figcaption>
      <div aria-hidden className="relative mt-4 h-48" dir="ltr">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-8 border-t border-line" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -start-8 -top-2 w-6 text-end text-[10px] text-ink-3">{valueFormatter(Math.round(t))}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 end-0 start-8 flex items-end justify-around">
          {data.map((d, i) => (
            <div key={i} className="relative flex h-full flex-1 items-end justify-center gap-1" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {series.map((s, j) => (
                <span key={s.key} className="w-3 rounded-t-[2px] transition-opacity sm:w-4" style={{ height: `${(num(d, s.key) / max) * 100}%`, background: color(j), opacity: hover === null || hover === i ? 1 : 0.4 }} />
              ))}
              {hover === i && (
                <span className="absolute bottom-full z-10 mb-1 w-max rounded-md border border-line bg-layer-2 px-2 py-1 text-xs text-ink shadow-md">
                  <b>{asText(readKey(d, categoryKey))}</b>
                  {series.map((s) => ` · ${s.label} ${valueFormatter(num(d, s.key))}`).join("")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="ms-8 mt-2 flex justify-around text-xs text-ink-2" dir="ltr">
        {data.map((d, i) => (
          <span key={i}>{asText(readKey(d, categoryKey))}</span>
        ))}
      </div>
      <table className="sr-only">
        <thead>
          <tr>
            <td />
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{asText(readKey(d, categoryKey))}</th>
              {series.map((s) => (
                <td key={s.key}>{valueFormatter(num(d, s.key))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
