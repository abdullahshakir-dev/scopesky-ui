"use client";

import NextLink from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "@scopesky/ui/icons";
import { cn } from "@scopesky/ui/utils";
import type { ComponentDoc } from "@/lib/types";

export function GuidanceTabs({ doc }: { doc: ComponentDoc }) {
  const tabs = [
    { id: "usage", label: "Usage" },
    { id: "props", label: "Properties", count: doc.props.length },
    { id: "a11y", label: "Accessibility" },
  ];
  const [tab, setTab] = useState("usage");
  return (
    <section aria-label="Guidelines" id="guidelines" className="scroll-mt-20">
      <div role="tablist" aria-label="Guidelines" className="flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn("-mb-px flex h-11 items-center gap-2 border-b-2 text-sm transition-colors", tab === t.id ? "border-focus font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink")}
          >
            {t.label}
            {t.count ? <span className="rounded-full bg-layer-selected px-1.5 text-[11px] font-normal text-ink-2">{t.count}</span> : null}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="panel-usage" aria-labelledby="tab-usage" hidden={tab !== "usage"} className="pt-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Guideline tone="do" title="When to use" items={doc.usage.use} />
          <Guideline tone="dont" title="When not to use" items={doc.usage.avoid} />
        </div>
        {doc.content.length > 0 && (
          <div className="mt-10">
            <h3 className="text-base font-semibold text-ink">Content and language</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-ink">
              {doc.content.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div role="tabpanel" id="panel-props" aria-labelledby="tab-props" hidden={tab !== "props"} className="pt-8">
        {doc.propsNote && <p className="mb-4 text-sm text-ink-2">{doc.propsNote}</p>}
        {doc.props.length ? <PropsTable doc={doc} /> : <p className="text-sm text-ink-2">This component has no configurable properties. Compose it from the parts shown in the code above.</p>}
      </div>

      <div role="tabpanel" id="panel-a11y" aria-labelledby="tab-a11y" hidden={tab !== "a11y"} className="pt-8">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-ink">
          {doc.a11y.map((a) => (
            <li key={a} className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {a}
            </li>
          ))}
        </ul>
        {doc.keyboard.length > 0 && (
          <>
            <h3 className="mt-10 text-base font-semibold text-ink">Keyboard</h3>
            <div className="mt-3 overflow-hidden rounded-box border border-line">
              <table className="w-full text-sm">
                <thead className="bg-layer text-start text-ink-2">
                  <tr>
                    <th className="w-48 px-4 py-2.5 text-start font-medium">Key</th>
                    <th className="px-4 py-2.5 text-start font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.keyboard.map((k) => (
                    <tr key={k.key} className="border-t border-line">
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap items-center gap-1">
                          {k.key.split(" / ").map((p, i) => (
                            <span key={p} className="inline-flex items-center gap-1">
                              {i > 0 && <span className="text-ink-3">or</span>}
                              <kbd className="inline-flex h-6 items-center rounded-sm border border-line-2 bg-layer px-1.5 font-sans text-xs text-ink shadow-[inset_0_-1px_0_var(--border)]">{p}</kbd>
                            </span>
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{k.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Guideline({ tone, title, items }: { tone: "do" | "dont"; title: string; items: string[] }) {
  return (
    <div className={cn("rounded-box border-t-[3px] bg-layer p-5", tone === "do" ? "border-success" : "border-danger")}>
      <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
        {tone === "do" ? <Check className="size-4 text-success" /> : <X className="size-4 text-danger" />}
        {title}
      </h3>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-6 text-ink">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export function PropsTable({ doc }: { doc: ComponentDoc }) {
  return (
    <div className="overflow-x-auto rounded-box border border-line">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-layer text-ink-2">
          <tr>
            <th className="px-4 py-2.5 text-start font-medium">Prop</th>
            <th className="px-4 py-2.5 text-start font-medium">Type</th>
            <th className="px-4 py-2.5 text-start font-medium">Default</th>
            <th className="px-4 py-2.5 text-start font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {doc.props.map((p) => (
            <tr key={p.name} className="border-t border-line align-top">
              <td className="px-4 py-3">
                <code className="rounded-sm bg-tint px-1.5 py-0.5 font-mono text-[12.5px] text-eyebrow">{p.name}</code>
              </td>
              <td className="max-w-64 px-4 py-3 font-mono text-[12.5px] leading-5 text-ink-2">{p.type}</td>
              <td className="px-4 py-3 font-mono text-[12.5px] text-ink-2">{p.default && p.default !== "—" ? p.default : "–"}</td>
              <td className="px-4 py-3 leading-6 text-ink">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-semibold text-ink">On this page</p>
      <ul className="flex flex-col gap-2 border-s border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={cn("-ms-px block border-s ps-3 transition-colors", active === i.id ? "border-accent text-ink" : "border-transparent text-ink-2 hover:text-ink")}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PagerLinks({ prev, next }: { prev?: { href: string; title: string }; next?: { href: string; title: string } }) {
  return (
    <div className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <NextLink href={prev.href} className="group flex flex-col gap-1 rounded-box border border-line p-4 transition-colors hover:border-line-2 hover:bg-layer">
          <span className="flex items-center gap-1 text-xs text-ink-2">
            <ChevronLeft className="size-3.5 rtl:rotate-180" /> Previous
          </span>
          <span className="text-sm font-medium text-ink group-hover:text-link">{prev.title}</span>
        </NextLink>
      ) : (
        <span />
      )}
      {next && (
        <NextLink href={next.href} className="group flex flex-col items-end gap-1 rounded-box border border-line p-4 text-end transition-colors hover:border-line-2 hover:bg-layer">
          <span className="flex items-center gap-1 text-xs text-ink-2">
            Next <ChevronRight className="size-3.5 rtl:rotate-180" />
          </span>
          <span className="text-sm font-medium text-ink group-hover:text-link">{next.title}</span>
        </NextLink>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <div className="text-sm text-ink-2">{eyebrow}</div>}
      <h1 className="text-[2.625rem] font-normal leading-[1.2] tracking-[-0.01em] text-ink">{title}</h1>
      {lead && <p className="max-w-[44rem] text-xl leading-[1.5] text-ink-2">{lead}</p>}
      {children}
    </header>
  );
}
