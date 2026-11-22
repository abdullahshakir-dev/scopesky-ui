"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AlertTriangle, Check, CheckCircle2, CircleAlert, Info, Sparkles, X } from "./icons.js";
import { cn } from "./utils.js";
import { Button } from "./button.js";
import { useDismiss, useFocusTrap } from "./hooks.js";

/* ---------- notification ---------- */

export type Kind = "success" | "warning" | "error" | "info";

const kindStyle: Record<Kind, { bar: string; bg: string; icon: ReactNode }> = {
  success: { bar: "border-s-success", bg: "bg-success-bg", icon: <CheckCircle2 className="size-5 fill-success text-bg" /> },
  warning: { bar: "border-s-warning", bg: "bg-warning-bg", icon: <AlertTriangle className="size-5 fill-warning text-ink" /> },
  error: { bar: "border-s-danger", bg: "bg-danger-bg", icon: <CircleAlert className="size-5 fill-danger text-bg" /> },
  info: { bar: "border-s-info", bg: "bg-info-bg", icon: <Info className="size-5 fill-info text-bg" /> },
};

export function Notification({
  kind = "info",
  title,
  subtitle,
  variant = "inline",
  action,
  onClose,
  lowContrast = true,
}: {
  kind?: Kind;
  title: string;
  subtitle?: string;
  variant?: "inline" | "toast";
  action?: string;
  onClose?: () => void;
  lowContrast?: boolean;
}) {
  const k = kindStyle[kind];
  return (
    <div
      role={kind === "error" || kind === "warning" ? "alert" : "status"}
      className={cn(
        "flex w-full items-start gap-3 overflow-hidden rounded-box border-s-4 text-sm text-ink",
        k.bar,
        lowContrast ? k.bg : "bg-inverse text-inverse-ink",
        lowContrast && "border border-s-4 border-black/10 dark:border-white/10",
        variant === "toast" ? "max-w-sm flex-col gap-1 py-3 ps-4 pe-12 shadow-[0_8px_24px_rgb(15_23_42/0.16)] relative" : "min-h-12 py-3 ps-4 pe-2 relative",
      )}
    >
      <span className={cn("shrink-0", variant === "toast" && "absolute start-4 top-3.5")}>{k.icon}</span>
      <div className={cn("flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-1", variant === "toast" && "ps-8 flex-col")}>
        <p className="font-semibold">{title}</p>
        {subtitle && <p>{subtitle}</p>}
        {variant === "toast" && <p className={cn("mt-2 text-xs", lowContrast ? "text-ink-2" : "opacity-80")}>Time stamp 09:30</p>}
      </div>
      {action && (
        <Button kind="ghost" size="sm" className="!pe-4 shrink-0 self-center">
          {action}
        </Button>
      )}
      {onClose && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={onClose}
          className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10", variant === "toast" && "absolute end-2 top-2")}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

/* ---------- modal ---------- */

export function Modal({
  open,
  onClose,
  label,
  heading,
  children,
  primary = "Save",
  secondary = "Cancel",
  danger,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  label?: string;
  heading: string;
  children: ReactNode;
  primary?: string;
  secondary?: string;
  danger?: boolean;
  size?: "xs" | "sm" | "md";
}) {
  const ref = useFocusTrap<HTMLDivElement>(open, "[data-autofocus]");
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4 animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role={danger ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={`${id}-h`}
        className={cn("flex w-full flex-col overflow-hidden rounded-xl border border-line bg-layer-2 text-ink shadow-[0_24px_64px_rgb(15_23_42/0.25)] animate-pop", size === "xs" ? "max-w-sm" : size === "sm" ? "max-w-lg" : "max-w-2xl")}
      >
        <div className="relative px-6 pt-6 pe-14">
          {label && <p className="text-xs text-ink-2">{label}</p>}
          <h2 id={`${id}-h`} className="mt-1 text-xl">
            {heading}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 pb-8 pt-2 text-sm leading-6 text-ink-2">{children}</div>
        <div className="flex justify-end gap-2 border-t border-line bg-layer px-6 py-4">
          <Button kind="tertiary" size="md" onClick={onClose} data-autofocus={danger ? "" : undefined}>
            {secondary}
          </Button>
          <Button kind={danger ? "danger" : "primary"} size="md" onClick={onClose} data-autofocus={danger ? undefined : ""}>
            {primary}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- progress ---------- */

export function ProgressBar({ label, value, max = 100, helper, status = "active", size = "big" }: { label: string; value?: number; max?: number; helper?: string; status?: "active" | "finished" | "error"; size?: "big" | "small" }) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-ink">
        <span>{label}</span>
        {status === "finished" && <CheckCircle2 aria-label="Finished" className="size-4 fill-success text-bg" />}
        {status === "error" && <CircleAlert aria-label="Error" className="size-4 fill-danger text-bg" />}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn("relative w-full overflow-hidden rounded-full bg-line", size === "big" ? "h-2" : "h-1.5")}
      >
        {indeterminate ? (
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,var(--accent)_40%,var(--primary)_60%,transparent_100%)] bg-[length:200%_100%]" />
        ) : (
          <div
            className={cn("h-full rounded-full transition-[width] duration-300", status === "error" ? "bg-danger" : status === "finished" ? "bg-success" : "bg-accent")}
            style={{ width: `${status === "error" ? 100 : pct}%` }}
          />
        )}
      </div>
      {helper && <p className={cn("text-xs", status === "error" ? "text-danger-text" : "text-ink-2")}>{helper}</p>}
    </div>
  );
}

export function ProgressIndicator({ steps, current, vertical }: { steps: { label: string; note?: string; invalid?: boolean }[]; current: number; vertical?: boolean }) {
  return (
    <ol className={cn("flex w-full", vertical ? "flex-col gap-0" : "flex-row")}>
      {steps.map((s, i) => {
        const state = s.invalid ? "invalid" : i < current ? "complete" : i === current ? "current" : "incomplete";
        return (
          <li key={s.label} aria-current={state === "current" ? "step" : undefined} className={cn("flex-1", vertical ? "flex gap-2 pb-6" : "flex min-w-0 flex-col")}>
            <span className={cn(vertical ? "h-auto w-px self-stretch" : "h-0.5 w-full", "order-none", state === "complete" || state === "current" ? "bg-accent" : "bg-line-2", vertical && "hidden")} />
            <div className={cn("flex items-start gap-2", vertical ? "" : "pt-2 pe-4")}>
              <span className="mt-0.5 shrink-0">
                {state === "complete" && <CheckCircle2 aria-hidden className="size-4 text-accent" />}
                {state === "current" && (
                  <span aria-hidden className="relative block size-4 rounded-full border-2 border-accent">
                    <span className="absolute inset-[3px] rounded-full bg-accent" />
                  </span>
                )}
                {state === "incomplete" && <span aria-hidden className="block size-4 rounded-full border-2 border-line-strong" />}
                {state === "invalid" && <CircleAlert aria-hidden className="size-4 fill-danger text-bg" />}
              </span>
              <span className="min-w-0">
                <span className={cn("block truncate text-sm", state === "incomplete" ? "text-ink-2" : "text-ink")}>{s.label}</span>
                {s.note && <span className={cn("block text-xs", s.invalid ? "text-danger-text" : "text-ink-2")}>{s.note}</span>}
                <span className="sr-only">{state}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Loading({ size = "large", label = "Loading" }: { size?: "large" | "small"; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center">
      <svg viewBox="0 0 100 100" className={cn("animate-spin text-accent [animation-duration:690ms]", size === "large" ? "size-20" : "size-4")}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth={size === "large" ? 10 : 14} />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth={size === "large" ? 10 : 14} strokeDasharray="264" strokeDashoffset="190" strokeLinecap="butt" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function InlineLoading({ state, text }: { state: "active" | "finished" | "error"; text: string }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-2 text-sm text-ink-2">
      {state === "active" && <Loading size="small" label="" />}
      {state === "finished" && <Check className="size-4 text-success" />}
      {state === "error" && <CircleAlert className="size-4 fill-danger text-bg" />}
      {text}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-md bg-[linear-gradient(90deg,var(--layer-selected)_0%,var(--layer-hover)_50%,var(--layer-selected)_100%)] bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}

/* ---------- tooltips & popovers ---------- */

type Side = "top" | "bottom";

export function Tooltip({ label, children, side = "top" }: { label: string; children: ReactNode; side?: Side }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      aria-describedby={id}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute start-1/2 z-40 w-max max-w-56 -translate-x-1/2 rounded-lg bg-inverse px-3 py-1.5 text-xs text-inverse-ink shadow-md transition-opacity duration-100 rtl:translate-x-1/2",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}

export function DefinitionTooltip({ term, definition }: { term: string; definition: string }) {
  return (
    <Tooltip label={definition} side="bottom">
      <button type="button" className="cursor-help border-b border-dotted border-ink-2 text-inherit">
        {term}
      </button>
    </Tooltip>
  );
}

export function Popover({
  trigger,
  children,
  label,
  align = "start",
  caret = true,
}: {
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-controls": string }) => ReactNode;
  children: ReactNode;
  label: string;
  align?: "start" | "end";
  caret?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useDismiss<HTMLSpanElement>(open, () => setOpen(false));
  return (
    <span ref={ref} className="relative inline-flex">
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-controls": id })}
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute top-full z-40 mt-2 w-72 rounded-box border border-line bg-layer-2 p-4 text-sm text-ink shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop",
            align === "start" ? "start-0" : "end-0",
          )}
        >
          {caret && <span aria-hidden className={cn("absolute -top-[5px] size-2.5 rotate-45 border-s border-t border-line bg-layer-2", align === "start" ? "start-4" : "end-4")} />}
          {children}
        </div>
      )}
    </span>
  );
}

export function Toggletip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Popover
      label={label}
      trigger={(p) => (
        <button type="button" aria-label={label} {...p} className="inline-flex size-6 items-center justify-center rounded-full text-ink-2 hover:text-ink">
          <Info className="size-4" />
        </button>
      )}
    >
      <div className="-m-4 rounded-box bg-inverse p-4 text-inverse-ink">{children}</div>
    </Popover>
  );
}

export function AILabel({ size = "sm", children }: { size?: "xs" | "sm" | "md"; children?: ReactNode }) {
  return (
    <Popover
      label="AI explained"
      trigger={(p) => (
        <button
          type="button"
          aria-label="AI: show explanation"
          {...p}
          className={cn(
            "inline-flex items-center justify-center gap-1 rounded-md border border-ink/80 bg-[linear-gradient(135deg,var(--layer)_0%,var(--tint)_100%)] font-semibold text-ink hover:border-ink",
            size === "xs" ? "h-5 px-1 text-[10px]" : size === "sm" ? "h-6 px-1.5 text-xs" : "h-8 px-2 text-sm",
          )}
        >
          AI
        </button>
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-1.5 text-xs text-ink-2">
          <Sparkles className="size-3.5 text-accent" /> AI explained
        </p>
        {children ?? (
          <>
            <p className="text-2xl">84%</p>
            <p className="text-sm font-semibold">Confidence score</p>
            <p className="text-sm text-ink-2">This summary was generated from the last 30 days of support tickets. Check the source records before acting on it.</p>
          </>
        )}
      </div>
    </Popover>
  );
}

export function Empty({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-box border border-dashed border-line-2 px-6 py-10 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-tint text-primary [&>svg]:size-6">{icon}</span>
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="text-sm text-ink-2">{body}</p>
      {action}
    </div>
  );
}

/* ---------- tag ---------- */

export type TagType = "gray" | "blue" | "green" | "red" | "warm" | "cyan" | "outline";

const tagStyles: Record<TagType, string> = {
  gray: "bg-layer-selected text-ink",
  blue: "bg-tint-2 text-info-text",
  green: "bg-success-bg text-success-text",
  red: "bg-danger-bg text-danger-text",
  warm: "bg-warning-bg text-warning-text",
  cyan: "bg-tint text-eyebrow",
  outline: "bg-transparent text-ink border border-line-strong",
};

export function Tag({ type = "gray", children, onDismiss, size = "md", selected, onSelect }: { type?: TagType; children: ReactNode; onDismiss?: () => void; size?: "sm" | "md" | "lg"; selected?: boolean; onSelect?: () => void }) {
  const cls = cn(
    "inline-flex items-center gap-1 rounded-full font-normal whitespace-nowrap",
    size === "sm" ? "h-[18px] px-2 text-xs" : size === "md" ? "h-6 px-2 text-xs" : "h-8 px-3 text-sm",
    onSelect ? (selected ? "bg-inverse text-inverse-ink" : "border border-line-strong text-ink hover:bg-layer-hover") : tagStyles[type],
  );
  if (onSelect)
    return (
      <button type="button" aria-pressed={selected} onClick={onSelect} className={cls}>
        {children}
      </button>
    );
  return (
    <span className={cn(cls, onDismiss && "pe-0.5")}>
      {children}
      {onDismiss && (
        <button type="button" aria-label={`Dismiss ${typeof children === "string" ? children : "tag"}`} onClick={onDismiss} className="inline-flex size-5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15">
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
