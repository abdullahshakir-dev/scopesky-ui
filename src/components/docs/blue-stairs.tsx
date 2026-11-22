"use client";

import { useState } from "react";
import { blueScale } from "@/lib/tokens";
import { cn, copyText } from "@scopesky/ui/utils";

// The eleven main steps of the ScopeSky blue scale, drawn as a rising staircase.
const steps = blueScale.filter((s) => ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"].includes(s.step));

export function BlueStairs() {
  const [hover, setHover] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const shown = hover ?? 7; // Blue 700 is the button colour, so it is the resting label
  const s = steps[shown];
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex h-56 items-end gap-1.5 sm:h-64" onMouseLeave={() => setHover(null)} role="list" aria-label="ScopeSky blue scale">
        {steps.map((st, i) => (
          <button
            key={st.step}
            type="button"
            role="listitem"
            aria-label={`Blue ${st.step}, ${st.hex}. Copy hex`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={async () => {
              await copyText(st.hex);
              setCopied(st.hex);
              setTimeout(() => setCopied(null), 1400);
            }}
            className={cn(
              "relative flex-1 origin-bottom rounded-t-[3px] animate-rise transition-[filter,transform] duration-150 hover:-translate-y-1 focus-visible:-translate-y-1",
              st.step === "50" && "ring-1 ring-inset ring-black/5",
            )}
            style={{ background: st.hex, height: `${28 + i * 7.2}%`, animationDelay: `${i * 55}ms` }}
          />
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-4 text-sm" aria-live="polite">
        <span className="text-ink">
          <span className="font-semibold">Blue {s.step}</span> <span className="font-mono text-[13px] text-ink-2">{s.hex}</span>
        </span>
        <span className="truncate text-ink-2">{copied ? `Copied ${copied}` : s.usage}</span>
      </div>
    </div>
  );
}
