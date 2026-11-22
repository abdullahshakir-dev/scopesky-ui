"use client";

import { useState } from "react";
import { Check } from "@scopesky/ui/icons";
import type { ScaleStep } from "@/lib/tokens";
import { cn, copyText } from "@scopesky/ui/utils";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  return {
    copied,
    copy: async (v: string) => {
      await copyText(v);
      setCopied(v);
      setTimeout(() => setCopied(null), 1400);
    },
  };
}

export function BrandSwatches({ items }: { items: { name: string; hex: string; rgb: string; token: string; usage: string }[] }) {
  const { copied, copy } = useCopy();
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((c) => (
        <button key={c.hex} type="button" onClick={() => copy(c.hex)} className="group overflow-hidden rounded-box border border-line text-start transition-colors hover:border-line-2" aria-label={`${c.name} ${c.hex}. Copy hex`}>
          <span className="relative block h-28 border-b border-line" style={{ background: c.hex }}>
            <span className={cn("absolute end-3 top-3 inline-flex items-center gap-1 rounded-sm bg-black/50 px-2 py-0.5 text-xs text-white transition-opacity", copied === c.hex ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")}>
              {copied === c.hex ? (
                <>
                  <Check className="size-3" /> Copied
                </>
              ) : (
                "Copy hex"
              )}
            </span>
          </span>
          <span className="flex flex-col gap-1 p-4">
            <span className="text-xl text-ink">{c.name}</span>
            <span className="font-mono text-[13px] text-ink">
              {c.hex} · RGB {c.rgb}
            </span>
            <span className="font-mono text-[13px] text-ink-2">{c.token}</span>
            <span className="mt-2 text-sm leading-6 text-ink-2">{c.usage}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

const ratingCls = (r: string) => (r === "—" ? "text-ink-3" : "bg-success-bg text-success-text");

export function ScaleTable({ name, steps }: { name: string; steps: ScaleStep[] }) {
  const { copied, copy } = useCopy();
  return (
    <div className="overflow-x-auto rounded-box border border-line">
      <table className="w-full min-w-[720px] text-sm">
        <caption className="sr-only">{name} scale with contrast ratios</caption>
        <thead className="bg-layer text-xs text-ink-2">
          <tr>
            <th className="w-16 px-4 py-2.5 text-start font-medium">Step</th>
            <th className="w-[30%] px-4 py-2.5 text-start font-medium">Swatch</th>
            <th className="px-4 py-2.5 text-start font-medium">Hex</th>
            <th className="px-4 py-2.5 text-start font-medium">vs white</th>
            <th className="px-4 py-2.5 text-start font-medium">vs Near Black</th>
            <th className="px-4 py-2.5 text-start font-medium">Usage</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s) => (
            <tr key={s.step} className="border-t border-line">
              <td className="px-4 py-2 font-mono text-[13px] text-ink">{s.step}</td>
              <td className="px-4 py-2">
                <button type="button" onClick={() => copy(s.hex)} aria-label={`Copy ${s.hex}`} className="relative block h-7 w-full rounded-sm border border-black/5" style={{ background: s.hex }}>
                  {copied === s.hex && <span className="absolute inset-0 flex items-center justify-center text-xs font-medium" style={{ color: parseInt(s.step) >= 500 ? "#fff" : "#0f172a" }}>Copied</span>}
                </button>
              </td>
              <td className="px-4 py-2 font-mono text-[13px] text-ink">{s.hex}</td>
              <td className="px-4 py-2 text-ink">
                <span className="inline-flex items-center gap-2 tabular-nums">
                  {s.vsWhite} <span className={cn("rounded-sm px-1 text-[11px] font-semibold", ratingCls(s.vsWhiteRating))}>{s.vsWhiteRating}</span>
                </span>
              </td>
              <td className="px-4 py-2 text-ink">
                <span className="inline-flex items-center gap-2 tabular-nums">
                  {s.vsBlack} <span className={cn("rounded-sm px-1 text-[11px] font-semibold", ratingCls(s.vsBlackRating))}>{s.vsBlackRating}</span>
                </span>
              </td>
              <td className="px-4 py-2 text-ink-2">{s.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
