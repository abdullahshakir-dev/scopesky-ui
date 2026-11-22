"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { GripVertical, X } from "./icons.js";
import { cn } from "./utils.js";
import { useFocusTrap } from "./hooks.js";

/* Overlays: rounded, soft shadow, sentence-case footers */

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
}

export const sBtn = {
  primary: "inline-flex h-9 items-center justify-center gap-2 rounded-box bg-primary px-4 text-sm font-medium text-on-color hover:bg-primary-hover",
  outline: "inline-flex h-9 items-center justify-center gap-2 rounded-box border border-line-2 bg-bg px-4 text-sm font-medium text-ink hover:bg-layer-hover",
  danger: "inline-flex h-9 items-center justify-center gap-2 rounded-box bg-danger-strong px-4 text-sm font-medium text-white hover:bg-[#a2191f]",
  ghost: "inline-flex h-9 items-center justify-center gap-2 rounded-box px-3 text-sm font-medium text-ink hover:bg-layer-hover",
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancel = "Cancel",
  action = "Delete",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  cancel?: string;
  action?: string;
}) {
  const close = () => onOpenChange(false);
  useEsc(open, close);
  const ref = useFocusTrap<HTMLDivElement>(open, "[data-cancel]");
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4 animate-fade">
      <div ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} className="w-full max-w-md rounded-xl border border-line bg-layer-2 p-6 shadow-[0_16px_48px_rgb(0_0_0/0.25)] animate-pop">
        <h2 id={`${id}-t`} className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p id={`${id}-d`} className="mt-2 text-sm text-ink-2">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" data-cancel onClick={close} className={sBtn.outline}>
            {cancel}
          </button>
          <button type="button" onClick={close} className={sBtn.danger}>
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sheet({ open, onOpenChange, side = "right", title, description, children, footer }: { open: boolean; onOpenChange: (o: boolean) => void; side?: "right" | "left"; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  const close = () => onOpenChange(false);
  useEsc(open, close);
  const ref = useFocusTrap<HTMLDivElement>(open);
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-overlay animate-fade" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        className={cn("absolute inset-y-0 flex w-[min(24rem,90vw)] flex-col border-line bg-layer-2 shadow-[0_0_48px_rgb(0_0_0/0.25)] animate-slide-in", side === "right" ? "end-0 border-s" : "start-0 border-e [animation-direction:reverse]")}
      >
        <div className="relative p-6 pe-12">
          <h2 id={`${id}-t`} className="text-base font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
          <button type="button" aria-label="Close" onClick={close} className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-layer-hover hover:text-ink">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  const close = () => onOpenChange(false);
  useEsc(open, close);
  const ref = useFocusTrap<HTMLDivElement>(open);
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-overlay animate-fade" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-layer-2 shadow-[0_-8px_48px_rgb(0_0_0/0.25)] animate-slide-up">
        <span aria-hidden className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line-2" />
        <div className="px-6 pt-4 text-center">
          <h2 id={`${id}-t`} className="text-base font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
        </div>
        <div className="overflow-auto p-6">{children}</div>
        {footer && <div className="flex flex-col gap-2 p-4 pt-0">{footer}</div>}
      </div>
    </div>
  );
}

export function HoverCard({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(true), 300);
  };
  const hide = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(false), 150);
  };
  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={() => setOpen(true)} onBlur={hide}>
      {trigger}
      {open && <div className="absolute start-1/2 top-full z-40 mt-2 w-72 -translate-x-1/2 rounded-box border border-line bg-layer-2 p-4 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop rtl:translate-x-1/2">{children}</div>}
    </span>
  );
}

/* ---------- layout primitives ---------- */

export function AspectRatio({ ratio, children }: { ratio: number; children: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-box" style={{ aspectRatio: ratio }}>
      {children}
    </div>
  );
}

export function Collapsible({ title, preview, rest }: { title: string; preview: string; rest: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className={sBtn.ghost}>
          {open ? "Hide" : `Show ${rest.length} more`}
        </button>
      </div>
      <div className="rounded-lg border border-line-2 px-4 py-2 font-mono text-sm text-ink">{preview}</div>
      <div id={id} hidden={!open} className="flex flex-col gap-2">
        {rest.map((r) => (
          <div key={r} className="rounded-lg border border-line-2 px-4 py-2 font-mono text-sm text-ink animate-fade">
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Resizable({ start, end }: { start: ReactNode; end: ReactNode }) {
  const [pct, setPct] = useState(40);
  const box = useRef<HTMLDivElement>(null);
  const drag = (e: React.PointerEvent) => {
    const el = box.current;
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const rtl = getComputedStyle(el).direction === "rtl";
      const x = rtl ? r.right - ev.clientX : ev.clientX - r.left;
      setPct(Math.min(80, Math.max(20, (x / r.width) * 100)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div ref={box} className="flex h-48 w-full max-w-lg overflow-hidden rounded-box border border-line-2">
      <div style={{ width: `${pct}%` }} className="flex items-center justify-center bg-layer p-4 text-sm text-ink">
        {start}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={20}
        aria-valuemax={80}
        aria-label="Resize panels"
        tabIndex={0}
        onPointerDown={drag}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(20, p - 5));
          if (e.key === "ArrowRight") setPct((p) => Math.min(80, p + 5));
        }}
        className="group relative flex w-px cursor-col-resize items-center justify-center bg-line-2 focus-visible:outline-offset-0"
      >
        <span className="absolute z-10 flex h-6 w-3 items-center justify-center rounded-sm border border-line-2 bg-bg group-hover:bg-layer-hover">
          <GripVertical className="size-3 text-ink-2" />
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-ink">{end}</div>
    </div>
  );
}

export function ScrollArea({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div tabIndex={0} role="region" aria-label="Scrollable list" className={cn("scroll-slim overflow-auto rounded-box border border-line-2", className)}>
      {children}
    </div>
  );
}

export function Separator({ orientation = "horizontal", decorative = true }: { orientation?: "horizontal" | "vertical"; decorative?: boolean }) {
  return <div role={decorative ? "none" : "separator"} aria-orientation={decorative ? undefined : orientation} className={cn("shrink-0 bg-line-2", orientation === "horizontal" ? "h-px w-full" : "h-full w-px")} />;
}
