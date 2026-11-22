"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { GripVertical, X } from "./icons.js";
import { cn } from "./utils.js";
import { useControllableState, useFocusTrap } from "./hooks.js";
import { useMessages } from "./locale.js";

/* Overlays: rounded, soft shadow, sentence-case footers */

function useEsc(open: boolean, onClose: () => void) {
  const cb = useRef(onClose);
  useEffect(() => {
    cb.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && cb.current();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
}

const btn = {
  primary: "inline-flex h-9 items-center justify-center gap-2 rounded-box bg-primary px-4 text-sm font-medium text-on-color hover:bg-primary-hover disabled:opacity-60",
  outline: "inline-flex h-9 items-center justify-center gap-2 rounded-box border border-line-2 bg-bg px-4 text-sm font-medium text-ink hover:bg-layer-hover disabled:opacity-60",
  danger: "inline-flex h-9 items-center justify-center gap-2 rounded-box bg-danger-strong px-4 text-sm font-medium text-white hover:bg-[#a2191f] disabled:opacity-60",
  ghost: "inline-flex h-9 items-center justify-center gap-2 rounded-box px-3 text-sm font-medium text-ink hover:bg-layer-hover",
};

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  /**
   * Runs when the action button is pressed. The dialog closes afterwards. If it
   * returns a promise, the buttons wait for it, and the dialog stays open if it rejects.
   */
  onAction: () => void | Promise<unknown>;
  /** Runs when the user cancels (button, Escape). The dialog closes either way. */
  onCancel?: () => void;
  cancelText?: ReactNode;
  actionText?: ReactNode;
  /** "danger" (default) for destructive actions. */
  tone?: "danger" | "primary";
  className?: string;
}

export function AlertDialog({ open, onOpenChange, title, description, onAction, onCancel, cancelText, actionText, tone = "danger", className }: AlertDialogProps) {
  const m = useMessages();
  const [busy, setBusy] = useState(false);
  const cancel = () => {
    if (busy) return;
    onCancel?.();
    onOpenChange(false);
  };
  const act = async () => {
    try {
      const r = onAction();
      if (r && typeof (r as Promise<unknown>).then === "function") {
        setBusy(true);
        await r;
      }
      onOpenChange(false);
    } catch {
      /* keep the dialog open so the user can retry; show the error yourself */
    } finally {
      setBusy(false);
    }
  };
  useEsc(open, cancel);
  const ref = useFocusTrap<HTMLDivElement>(open, "[data-cancel]");
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4 animate-fade">
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-d`}
        aria-busy={busy || undefined}
        className={cn("w-full max-w-md rounded-xl border border-line bg-layer-2 p-6 shadow-[0_16px_48px_rgb(0_0_0/0.25)] animate-pop", className)}
      >
        <h2 id={`${id}-t`} className="text-base font-semibold text-ink">
          {title}
        </h2>
        <div id={`${id}-d`} className="mt-2 text-sm text-ink-2">
          {description}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" data-cancel disabled={busy} onClick={cancel} className={btn.outline}>
            {cancelText ?? m.cancel}
          </button>
          <button type="button" disabled={busy} onClick={act} className={tone === "danger" ? btn.danger : btn.primary}>
            {busy && <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {actionText ?? m.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, side = "right", title, description, children, footer, className }: PanelProps & { side?: "right" | "left" }) {
  const m = useMessages();
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
        className={cn(
          "absolute inset-y-0 flex w-[min(24rem,90vw)] flex-col border-line bg-layer-2 shadow-[0_0_48px_rgb(0_0_0/0.25)] animate-slide-in",
          side === "right" ? "end-0 border-s" : "start-0 border-e [animation-direction:reverse]",
          className,
        )}
      >
        <div className="relative p-6 pe-12">
          <h2 id={`${id}-t`} className="text-base font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
          <button type="button" aria-label={m.close} onClick={close} className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-layer-hover hover:text-ink">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onOpenChange, title, description, children, footer, className }: PanelProps) {
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
        className={cn("absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-layer-2 shadow-[0_-8px_48px_rgb(0_0_0/0.25)] animate-slide-up", className)}
      >
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

export function HoverCard({ trigger, children, openDelay = 300, closeDelay = 150, className }: { trigger: ReactNode; children: ReactNode; openDelay?: number; closeDelay?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const show = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(false), closeDelay);
  };
  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={() => setOpen(true)} onBlur={hide}>
      {trigger}
      {open && (
        <div className={cn("absolute start-1/2 top-full z-40 mt-2 w-72 -translate-x-1/2 rounded-box border border-line bg-layer-2 p-4 shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop rtl:translate-x-1/2", className)}>
          {children}
        </div>
      )}
    </span>
  );
}

/* ---------- layout primitives ---------- */

export function AspectRatio({ ratio, children, className }: { ratio: number; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-box", className)} style={{ aspectRatio: ratio }}>
      {children}
    </div>
  );
}

export interface CollapsibleProps {
  title: ReactNode;
  /** Always visible, above the part that opens. */
  preview?: ReactNode;
  /** The part that opens and closes. */
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showText?: ReactNode;
  hideText?: ReactNode;
  className?: string;
}

export function Collapsible({ title, preview, children, open, defaultOpen = false, onOpenChange, showText, hideText, className }: CollapsibleProps) {
  const m = useMessages();
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const id = useId();
  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-ink">{title}</div>
        <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(!isOpen)} className={btn.ghost}>
          {isOpen ? (hideText ?? m.hide) : (showText ?? m.showMore)}
        </button>
      </div>
      {preview}
      <div id={id} hidden={!isOpen} className="flex flex-col gap-2 animate-fade">
        {children}
      </div>
    </div>
  );
}

export interface ResizableProps {
  start: ReactNode;
  end: ReactNode;
  /** Width of the start panel, in percent. */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export function Resizable({ start, end, size, defaultSize = 40, onSizeChange, min = 20, max = 80, label, className }: ResizableProps) {
  const m = useMessages();
  const [pct, setPct] = useControllableState(size, defaultSize, onSizeChange);
  const box = useRef<HTMLDivElement>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const isRtl = () => !!box.current && getComputedStyle(box.current).direction === "rtl";
  const drag = (e: ReactPointerEvent) => {
    const el = box.current;
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rtl = isRtl();
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = rtl ? r.right - ev.clientX : ev.clientX - r.left;
      setPct(clamp((x / r.width) * 100));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div ref={box} className={cn("flex h-48 w-full max-w-lg overflow-hidden rounded-box border border-line-2", className)}>
      <div style={{ width: `${pct}%` }} className="flex items-center justify-center overflow-auto bg-layer p-4 text-sm text-ink">
        {start}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label ?? m.resizePanels}
        tabIndex={0}
        onPointerDown={drag}
        onKeyDown={(e) => {
          const grow = isRtl() ? "ArrowLeft" : "ArrowRight";
          const shrink = isRtl() ? "ArrowRight" : "ArrowLeft";
          if (e.key === shrink) setPct((p) => clamp(p - 5));
          if (e.key === grow) setPct((p) => clamp(p + 5));
          if (e.key === "Home") setPct(min);
          if (e.key === "End") setPct(max);
        }}
        className="group relative flex w-px cursor-col-resize items-center justify-center bg-line-2 focus-visible:outline-offset-0"
      >
        <span className="absolute z-10 flex h-6 w-3 items-center justify-center rounded-sm border border-line-2 bg-bg group-hover:bg-layer-hover">
          <GripVertical className="size-3 text-ink-2" />
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4 text-sm text-ink">{end}</div>
    </div>
  );
}

export function ScrollArea({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  const m = useMessages();
  return (
    <div tabIndex={0} role="region" aria-label={label ?? m.scrollableRegion} className={cn("scroll-slim overflow-auto rounded-box border border-line-2", className)}>
      {children}
    </div>
  );
}

export function Separator({ orientation = "horizontal", decorative = true, className }: { orientation?: "horizontal" | "vertical"; decorative?: boolean; className?: string }) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn("shrink-0 bg-line-2", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
    />
  );
}
