"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, CheckCircle2, CircleAlert, Info, Sparkles, X } from "./icons.js";
import { cn } from "./utils.js";
import { Button } from "./button.js";
import { useControllableState, useDismiss, useFocusTrap } from "./hooks.js";
import { useMessages } from "./locale.js";

/* ---------- notification ---------- */

export type Kind = "success" | "warning" | "error" | "info";

const kindStyle: Record<Kind, { bar: string; bg: string; icon: ReactNode }> = {
  success: { bar: "border-s-success", bg: "bg-success-bg", icon: <CheckCircle2 className="size-5 fill-success text-bg" /> },
  warning: { bar: "border-s-warning", bg: "bg-warning-bg", icon: <AlertTriangle className="size-5 fill-warning text-ink" /> },
  error: { bar: "border-s-danger", bg: "bg-danger-bg", icon: <CircleAlert className="size-5 fill-danger text-bg" /> },
  info: { bar: "border-s-info", bg: "bg-info-bg", icon: <Info className="size-5 fill-info text-bg" /> },
};

export interface NotificationProps {
  kind?: Kind;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Extra content under the subtitle. */
  children?: ReactNode;
  variant?: "inline" | "toast";
  /** Label of the action button. Shown together with onAction. */
  actionText?: ReactNode;
  onAction?: () => void;
  /** Shows a close button. */
  onClose?: () => void;
  /** Toasts: when it happened, for example "09:30". */
  timestamp?: ReactNode;
  lowContrast?: boolean;
  className?: string;
}

export function Notification({ kind = "info", title, subtitle, children, variant = "inline", actionText, onAction, onClose, timestamp, lowContrast = true, className }: NotificationProps) {
  const m = useMessages();
  const k = kindStyle[kind];
  return (
    <div
      role={kind === "error" || kind === "warning" ? "alert" : "status"}
      className={cn(
        "relative flex w-full items-start gap-3 overflow-hidden rounded-box border-s-4 text-sm text-ink",
        k.bar,
        lowContrast ? k.bg : "bg-inverse text-inverse-ink",
        lowContrast && "border border-s-4 border-black/10 dark:border-white/10",
        variant === "toast" ? "max-w-sm flex-col gap-1 py-3 ps-4 pe-12 shadow-[0_8px_24px_rgb(15_23_42/0.16)]" : "min-h-12 py-3 ps-4 pe-2",
        className,
      )}
    >
      <span className={cn("shrink-0", variant === "toast" && "absolute start-4 top-3.5")}>{k.icon}</span>
      <div className={cn("flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-1", variant === "toast" && "flex-col ps-8")}>
        <p className="font-semibold">{title}</p>
        {subtitle && <p>{subtitle}</p>}
        {children}
        {variant === "toast" && timestamp && <p className={cn("mt-2 text-xs", lowContrast ? "text-ink-2" : "opacity-80")}>{timestamp}</p>}
      </div>
      {actionText && onAction && (
        <Button kind="ghost" size="sm" onClick={onAction} className={cn("!pe-4 shrink-0", variant === "toast" ? "ms-8 self-start" : "self-center")}>
          {actionText}
        </Button>
      )}
      {onClose && (
        <button
          type="button"
          aria-label={m.closeNotification}
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

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label?: ReactNode;
  heading: ReactNode;
  children: ReactNode;
  primaryText?: ReactNode;
  secondaryText?: ReactNode;
  /** The primary button. Close the modal yourself when the work is done. Without it, the button just closes. */
  onPrimaryClick?: () => void;
  /** The secondary button. The modal closes afterwards. */
  onSecondaryClick?: () => void;
  primaryDisabled?: boolean;
  /** Shows a spinner on the primary button and disables both buttons. */
  primaryLoading?: boolean;
  /** Makes the primary button submit this form (the id of a <form> inside or outside the modal). */
  formId?: string;
  danger?: boolean;
  size?: "xs" | "sm" | "md";
  /** Replace the footer, or pass null for none. */
  footer?: ReactNode | null;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  label,
  heading,
  children,
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled,
  primaryLoading,
  formId,
  danger,
  size = "sm",
  footer,
  className,
}: ModalProps) {
  const m = useMessages();
  const ref = useFocusTrap<HTMLDivElement>(open, "[data-autofocus]");
  const id = useId();
  const close = () => !primaryLoading && onOpenChange(false);
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4 animate-fade" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={ref}
        role={danger ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={`${id}-h`}
        aria-busy={primaryLoading || undefined}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-xl border border-line bg-layer-2 text-ink shadow-[0_24px_64px_rgb(15_23_42/0.25)] animate-pop",
          size === "xs" ? "max-w-sm" : size === "sm" ? "max-w-lg" : "max-w-2xl",
          className,
        )}
      >
        <div className="relative px-6 pt-6 pe-14">
          {label && <p className="text-xs text-ink-2">{label}</p>}
          <h2 id={`${id}-h`} className="mt-1 text-xl">
            {heading}
          </h2>
          <button type="button" aria-label={m.close} onClick={close} className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 pb-8 pt-2 text-sm leading-6 text-ink-2">{children}</div>
        {footer !== undefined ? (
          footer && <div className="flex justify-end gap-2 border-t border-line bg-layer px-6 py-4">{footer}</div>
        ) : (
          <div className="flex justify-end gap-2 border-t border-line bg-layer px-6 py-4">
            <Button
              kind="tertiary"
              size="md"
              disabled={primaryLoading}
              onClick={() => {
                onSecondaryClick?.();
                onOpenChange(false);
              }}
              data-autofocus={danger ? "" : undefined}
            >
              {secondaryText ?? m.cancel}
            </Button>
            <Button
              kind={danger ? "danger" : "primary"}
              size="md"
              type={formId ? "submit" : "button"}
              form={formId}
              disabled={primaryDisabled || primaryLoading}
              aria-busy={primaryLoading || undefined}
              onClick={formId ? undefined : () => (onPrimaryClick ? onPrimaryClick() : onOpenChange(false))}
              icon={primaryLoading ? <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : undefined}
              data-autofocus={danger ? undefined : ""}
            >
              {primaryText ?? m.save}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- progress ---------- */

export function ProgressBar({
  label,
  value,
  max = 100,
  helper,
  status = "active",
  size = "big",
  className,
}: {
  label: string;
  /** Leave out for an indeterminate bar. */
  value?: number;
  max?: number;
  helper?: ReactNode;
  status?: "active" | "finished" | "error";
  size?: "big" | "small";
  className?: string;
}) {
  const m = useMessages();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-sm text-ink">
        <span>{label}</span>
        {status === "finished" && <CheckCircle2 aria-label={m.finished} role="img" className="size-4 fill-success text-bg" />}
        {status === "error" && <CircleAlert aria-label={m.error} role="img" className="size-4 fill-danger text-bg" />}
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

export function ProgressIndicator({
  steps,
  current,
  vertical,
  className,
}: {
  steps: readonly { label: ReactNode; note?: ReactNode; invalid?: boolean }[];
  current: number;
  vertical?: boolean;
  className?: string;
}) {
  const m = useMessages();
  const stateText = { complete: m.stepComplete, current: m.stepCurrent, incomplete: m.stepIncomplete, invalid: m.stepInvalid };
  return (
    <ol className={cn("flex w-full", vertical ? "flex-col gap-0" : "flex-row", className)}>
      {steps.map((s, i) => {
        const state = s.invalid ? "invalid" : i < current ? "complete" : i === current ? "current" : "incomplete";
        return (
          <li key={i} aria-current={state === "current" ? "step" : undefined} className={cn("flex-1", vertical ? "flex gap-2 pb-6" : "flex min-w-0 flex-col")}>
            <span className={cn(vertical ? "hidden" : "h-0.5 w-full", state === "complete" || state === "current" ? "bg-accent" : "bg-line-2")} />
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
                <span className="sr-only">{stateText[state]}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Loading({ size = "large", label, className }: { size?: "large" | "small"; label?: string; className?: string }) {
  const m = useMessages();
  return (
    <span role="status" className={cn("inline-flex items-center", className)}>
      <svg aria-hidden viewBox="0 0 100 100" className={cn("animate-spin text-accent [animation-duration:690ms]", size === "large" ? "size-20" : "size-4")}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth={size === "large" ? 10 : 14} />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth={size === "large" ? 10 : 14} strokeDasharray="264" strokeDashoffset="190" strokeLinecap="butt" />
      </svg>
      {label !== "" && <span className="sr-only">{label ?? m.loading}</span>}
    </span>
  );
}

export function InlineLoading({ state, text, className }: { state: "active" | "finished" | "error"; text: ReactNode; className?: string }) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 text-sm text-ink-2", className)}>
      {state === "active" && <Loading size="small" label="" />}
      {state === "finished" && <Check aria-hidden className="size-4 text-success" />}
      {state === "error" && <CircleAlert aria-hidden className="size-4 fill-danger text-bg" />}
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

export function Tooltip({ label, children, side = "top", className }: { label: ReactNode; children: ReactNode; side?: Side; className?: string }) {
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
          className,
        )}
      >
        {label}
      </span>
    </span>
  );
}

export function DefinitionTooltip({ term, definition }: { term: ReactNode; definition: ReactNode }) {
  return (
    <Tooltip label={definition} side="bottom">
      <button type="button" className="cursor-help border-b border-dotted border-ink-2 text-inherit">
        {term}
      </button>
    </Tooltip>
  );
}

export interface PopoverProps {
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-controls": string }) => ReactNode;
  children: ReactNode;
  label: string;
  align?: "start" | "end";
  caret?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Popover({ trigger, children, label, align = "start", caret = true, open, defaultOpen = false, onOpenChange, className }: PopoverProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const id = useId();
  const ref = useDismiss<HTMLSpanElement>(isOpen, () => setOpen(false));
  return (
    <span ref={ref} className="relative inline-flex">
      {trigger({ onClick: () => setOpen(!isOpen), "aria-expanded": isOpen, "aria-controls": id })}
      {isOpen && (
        <div
          id={id}
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute top-full z-40 mt-2 w-72 rounded-box border border-line bg-layer-2 p-4 text-sm text-ink shadow-[0_8px_24px_rgb(15_23_42/0.14)] animate-pop",
            align === "start" ? "start-0" : "end-0",
            className,
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

export function AILabel({ size = "sm", title, label, children }: { size?: "xs" | "sm" | "md"; title?: ReactNode; label?: string; children: ReactNode }) {
  const m = useMessages();
  return (
    <Popover
      label={typeof title === "string" ? title : m.aiExplained}
      trigger={(p) => (
        <button
          type="button"
          aria-label={label ?? m.aiShowExplanation}
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
          <Sparkles className="size-3.5 text-accent" /> {title ?? m.aiExplained}
        </p>
        {children}
      </div>
    </Popover>
  );
}

export function Empty({ icon, title, body, action, className }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full max-w-sm flex-col items-center gap-3 rounded-box border border-dashed border-line-2 px-6 py-10 text-center", className)}>
      {icon && <span className="inline-flex size-12 items-center justify-center rounded-full bg-tint text-primary [&>svg]:size-6">{icon}</span>}
      <p className="text-base font-semibold text-ink">{title}</p>
      {body && <p className="text-sm text-ink-2">{body}</p>}
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

export interface TagProps {
  type?: TagType;
  children: ReactNode;
  /** Shows a dismiss button. */
  onDismiss?: () => void;
  /** Name for the dismiss button when children isn't plain text. */
  dismissLabel?: string;
  size?: "sm" | "md" | "lg";
  /** Makes the tag a toggle button (filter chip). */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
}

export function Tag({ type = "gray", children, onDismiss, dismissLabel, size = "md", selected = false, onSelectedChange, className }: TagProps) {
  const m = useMessages();
  const cls = cn(
    "inline-flex items-center gap-1 rounded-full font-normal whitespace-nowrap",
    size === "sm" ? "h-[18px] px-2 text-xs" : size === "md" ? "h-6 px-2 text-xs" : "h-8 px-3 text-sm",
    onSelectedChange ? (selected ? "bg-inverse text-inverse-ink" : "border border-line-strong text-ink hover:bg-layer-hover") : tagStyles[type],
    className,
  );
  if (onSelectedChange)
    return (
      <button type="button" aria-pressed={selected} onClick={() => onSelectedChange(!selected)} className={cls}>
        {children}
      </button>
    );
  return (
    <span className={cn(cls, onDismiss && "pe-0.5")}>
      {children}
      {onDismiss && (
        <button
          type="button"
          aria-label={m.dismiss(dismissLabel ?? (typeof children === "string" ? children : "tag"))}
          onClick={onDismiss}
          className="inline-flex size-5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
