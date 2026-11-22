"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, Check, ChevronDown, CircleDashed, Copy, Loader2, ThumbsUp } from "./icons.js";
import { cn } from "./utils.js";
import { Avatar } from "./data.js";

export function Bubble({ from = "them", children, tone }: { from?: "me" | "them"; children: ReactNode; tone?: "default" | "error" }) {
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6",
        from === "me" ? "ms-auto rounded-ee-md bg-primary text-on-color" : "rounded-es-md bg-layer text-ink",
        tone === "error" && "border border-danger bg-danger-bg text-danger-text",
      )}
    >
      {children}
    </div>
  );
}

export function Marker({ variant = "divider", children }: { variant?: "divider" | "status" | "system"; children: ReactNode }) {
  if (variant === "divider")
    return (
      <div role="separator" className="flex items-center gap-3 text-xs text-ink-2">
        <span className="h-px flex-1 bg-line" />
        {children}
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  if (variant === "status")
    return (
      <p className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs text-success-text">
        <Check className="size-3" />
        {children}
      </p>
    );
  return <p className="text-center text-xs text-ink-2">{children}</p>;
}

export function Message({ name, time, from = "them", children, footer = true }: { name: string; time: string; from?: "me" | "them"; children: ReactNode; footer?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className={cn("flex w-full gap-3", from === "me" && "flex-row-reverse")} aria-label={`${name}, ${time}`}>
      <Avatar name={name} size="sm" />
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", from === "me" && "items-end")}>
        <header className="flex items-baseline gap-2 text-xs">
          <span className="font-semibold text-ink">{name}</span>
          <time className="text-ink-2">{time}</time>
        </header>
        <Bubble from={from}>{children}</Bubble>
        {footer && from === "them" && (
          <div className="flex gap-1 text-ink-2">
            <button type="button" aria-label="Copy message" className="inline-flex size-7 items-center justify-center rounded-md hover:bg-layer-hover hover:text-ink">
              <Copy className="size-3.5" />
            </button>
            <button type="button" aria-label="Helpful" aria-pressed={liked} onClick={() => setLiked(!liked)} className={cn("inline-flex size-7 items-center justify-center rounded-md hover:bg-layer-hover hover:text-ink", liked && "text-link")}>
              <ThumbsUp className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function MessageScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  return (
    <div className="relative w-full max-w-lg">
      <div
        ref={ref}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 24);
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
          <ArrowDown className="size-3.5" /> Jump to latest
        </button>
      )}
    </div>
  );
}

export function Trace({ steps }: { steps: { label: string; detail: string; state: "done" | "running" | "pending" }[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full max-w-md overflow-hidden rounded-box border border-line-2 bg-bg">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-start text-sm font-medium text-ink hover:bg-layer-hover">
        <span>
          Checked {steps.filter((s) => s.state === "done").length} of {steps.length} steps
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ol className="relative border-t border-line px-4 py-3">
          {steps.map((s, i) => (
            <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
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
                <span className="block text-xs text-ink-2">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
