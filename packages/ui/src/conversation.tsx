"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, Check, ChevronDown, CircleDashed, Copy, Loader2, ThumbsUp } from "./icons.js";
import { cn, copyText } from "./utils.js";
import { Avatar } from "./data.js";
import { useControllableState } from "./hooks.js";
import { useMessages } from "./locale.js";

export function Bubble({ from = "them", children, tone, className }: { from?: "me" | "them"; children: ReactNode; tone?: "default" | "error"; className?: string }) {
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6",
        from === "me" ? "ms-auto rounded-ee-md bg-primary text-on-color" : "rounded-es-md bg-layer text-ink",
        tone === "error" && "border border-danger bg-danger-bg text-danger-text",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Marker({ variant = "divider", children, className }: { variant?: "divider" | "status" | "system"; children: ReactNode; className?: string }) {
  if (variant === "divider")
    return (
      <div role="separator" className={cn("flex items-center gap-3 text-xs text-ink-2", className)}>
        <span className="h-px flex-1 bg-line" />
        {children}
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  if (variant === "status")
    return (
      <p className={cn("mx-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs text-success-text", className)}>
        <Check className="size-3" />
        {children}
      </p>
    );
  return <p className={cn("text-center text-xs text-ink-2", className)}>{children}</p>;
}

export interface MessageProps {
  name: string;
  time: ReactNode;
  from?: "me" | "them";
  children: ReactNode;
  /** Text the copy button copies. Defaults to children when they are plain text; without either, there is no copy button. */
  text?: string;
  /** Shows the copy / helpful buttons under messages from others. */
  footer?: boolean;
  helpful?: boolean;
  defaultHelpful?: boolean;
  onHelpfulChange?: (helpful: boolean) => void;
  className?: string;
}

export function Message({ name, time, from = "them", children, text, footer = true, helpful, defaultHelpful = false, onHelpfulChange, className }: MessageProps) {
  const m = useMessages();
  const [liked, setLiked] = useControllableState(helpful, defaultHelpful, onHelpfulChange);
  const [copied, setCopied] = useState(false);
  const copySource = text ?? (typeof children === "string" ? children : undefined);
  return (
    <article className={cn("flex w-full gap-3", from === "me" && "flex-row-reverse", className)} aria-label={typeof time === "string" ? `${name}, ${time}` : name}>
      <Avatar name={name} size="sm" />
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", from === "me" && "items-end")}>
        <header className="flex items-baseline gap-2 text-xs">
          <span className="font-semibold text-ink">{name}</span>
          <time className="text-ink-2">{time}</time>
        </header>
        <Bubble from={from}>{children}</Bubble>
        {footer && from === "them" && (
          <div className="flex gap-1 text-ink-2">
            {copySource !== undefined && (
              <button
                type="button"
                aria-label={copied ? m.copied : m.copyMessage}
                title={copied ? m.copied : m.copyMessage}
                onClick={async () => {
                  if (await copyText(copySource)) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }
                }}
                className="inline-flex size-7 items-center justify-center rounded-md hover:bg-layer-hover hover:text-ink"
              >
                {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              </button>
            )}
            <button
              type="button"
              aria-label={m.helpful}
              title={m.helpful}
              aria-pressed={liked}
              onClick={() => setLiked(!liked)}
              className={cn("inline-flex size-7 items-center justify-center rounded-md hover:bg-layer-hover hover:text-ink", liked && "text-link")}
            >
              <ThumbsUp className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

/** A scrolling message list that starts at the bottom and follows new messages while the reader is there. */
export function MessageScroller({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  const m = useMessages();
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const stick = useRef(true);
  const count = Children.count(children);
  useEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [count]);
  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <div
        ref={ref}
        role="log"
        aria-live="polite"
        aria-label={label ?? m.conversation}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
          stick.current = bottom;
          setAtBottom(bottom);
        }}
        className="scroll-slim flex h-72 flex-col gap-4 overflow-y-auto rounded-box border border-line-2 bg-bg p-4"
      >
        {children}
      </div>
      {!atBottom && (
        <button
          type="button"
          onClick={() => ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })}
          className="absolute bottom-3 start-1/2 inline-flex h-8 -translate-x-1/2 items-center gap-1 rounded-full border border-line-2 bg-bg px-3 text-xs text-ink shadow-md animate-pop hover:bg-layer-hover rtl:translate-x-1/2"
        >
          <ArrowDown className="size-3.5" /> {m.jumpToLatest}
        </button>
      )}
    </div>
  );
}

export interface TraceStep {
  label: ReactNode;
  detail?: ReactNode;
  state: "done" | "running" | "pending";
}

export function Trace({
  steps,
  summary,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
}: {
  steps: readonly TraceStep[];
  /** The header text. Defaults to "Checked 2 of 4 steps". */
  summary?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const m = useMessages();
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-box border border-line-2 bg-bg", className)}>
      <button type="button" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} className="flex w-full items-center justify-between px-4 py-3 text-start text-sm font-medium text-ink hover:bg-layer-hover">
        <span>{summary ?? m.stepsDone(steps.filter((s) => s.state === "done").length, steps.length)}</span>
        <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <ol className="relative border-t border-line px-4 py-3">
          {steps.map((s, i) => (
            <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {i < steps.length - 1 && <span aria-hidden className="absolute start-[7px] top-5 h-[calc(100%-12px)] w-px bg-line-2" />}
              <span className="mt-0.5 shrink-0">
                {s.state === "done" && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-success text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                {s.state === "running" && <Loader2 className="size-4 animate-spin text-accent" />}
                {s.state === "pending" && <CircleDashed className="size-4 text-ink-3" />}
              </span>
              <span>
                <span className={cn("block text-sm", s.state === "pending" ? "text-ink-2" : "text-ink")}>{s.label}</span>
                {s.detail && <span className="block text-xs text-ink-2">{s.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
