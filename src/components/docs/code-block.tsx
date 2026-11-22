"use client";

import { Fragment, useState, type ReactNode } from "react";
import { cn } from "@scopesky/ui/utils";
import { CopyButton } from "@scopesky/ui/button";

/** Tiny highlighter for JSX/TS snippets: strings, tags, keywords, comments. */
function highlight(code: string): ReactNode[] {
  const re = /(\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(<\/?[A-Za-z][\w.]*)|(\b(?:import|from|export|const|let|return|function|default|true|false|null|undefined)\b)|(\b[a-zA-Z_][\w-]*(?==))|(\{|\}|\/>|>)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [tok] = m;
    const cls = m[1]
      ? "text-ink-3 italic"
      : m[2]
        ? "text-[#0e6027] dark:text-[#6fdc8c]"
        : m[3]
          ? "text-[#006b9b] dark:text-[#65c0e9]"
          : m[4]
            ? "text-[#8a3c04] dark:text-[#f1c21b]"
            : m[5]
              ? "text-[#5e6e84] dark:text-[#a3afbf]"
              : "text-ink-3";
    out.push(
      <span key={k++} className={cls}>
        {tok}
      </span>,
    );
    last = m.index + tok.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({ code, title, className, tabs }: { code: string; title?: string; className?: string; tabs?: { label: string; code: string }[] }) {
  const [tab, setTab] = useState(0);
  const current = tabs ? tabs[tab].code : code;
  return (
    <div className={cn("overflow-hidden rounded-box border border-line bg-code", className)} dir="ltr">
      <div className="flex h-11 items-center justify-between gap-2 border-b border-line ps-4 pe-1.5">
        {tabs ? (
          <div role="tablist" aria-label="Code format" className="flex h-full gap-4">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={cn("-mb-px border-b-2 text-xs font-medium transition-colors", tab === i ? "border-accent text-ink" : "border-transparent text-ink-2 hover:text-ink")}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs font-medium text-ink-2">{title}</span>
        )}
        <CopyButton value={current} label="Copy code" />
      </div>
      <pre className="scroll-slim max-h-[28rem] overflow-auto p-4 font-mono text-[13px] leading-[1.7] text-ink">
        <code>
          {current.split("\n").map((line, i) => (
            <Fragment key={i}>
              {highlight(line)}
              {"\n"}
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
}
